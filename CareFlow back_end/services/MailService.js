const nodemailer = require('nodemailer');
const redisClient = require('../config/redis');
require('dotenv').config();

// Config values and sensible defaults
const CONFIRMATION_CODE_EXPIRY = 10 * 60; // seconds

// Determine production SMTP host/port safely: if EMAIL_HOST is set to 'maildev' (e.g. in Docker),
// prefer explicit SMTP env vars or sane defaults so production transporter doesn't accidentally point to MailDev.
const prodHost = (process.env.EMAIL_SMTP_HOST && process.env.EMAIL_SMTP_HOST.trim())
  || (process.env.EMAIL_HOST && process.env.EMAIL_HOST.trim() !== 'maildev' ? process.env.EMAIL_HOST.trim() : 'smtp.gmail.com');
const prodPort = process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT, 10)
  : (process.env.EMAIL_PORT && parseInt(process.env.EMAIL_PORT, 10)) || 587;
const prodUser = process.env.EMAIL_USER;
const prodPass = (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '');

// MailDev/dev transporter settings (MailDev commonly listens on port 1025)
const devHost = process.env.MAILDEV_HOST || (process.env.EMAIL_HOST === 'maildev' ? 'maildev' : 'maildev');
const devPort = process.env.MAILDEV_PORT ? parseInt(process.env.MAILDEV_PORT, 10) : (process.env.EMAIL_PORT === '1025' ? 1025 : 1025);

const fromEnv = process.env.EMAIL_FROM || prodUser || 'noreply@careflow.local';

// Create transporters
const productionTransporter = nodemailer.createTransport({
  host: prodHost,
  port: prodPort,
  secure: prodPort === 465,
  auth: prodUser && prodPass ? { user: prodUser, pass: prodPass } : undefined,
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true
});

const developmentTransporter = nodemailer.createTransport({
  host: devHost,
  port: devPort,
  secure: false,
  ignoreTLS: true
});

// Verify transporters at startup (best effort)
(async () => {
  try {
    await productionTransporter.verify();
    console.log('✅ Production mail transporter ready (SMTP %s:%s)', prodHost, prodPort);
  } catch (err) {
    console.warn('⚠️ Production mail transporter verification failed:', err && err.message ? err.message : err);
  }

  // Only verify development transporter when it's enabled (don't touch MailDev in production)
  const devEnabled = typeof process.env.SEND_DEV_EMAILS !== 'undefined'
    ? process.env.SEND_DEV_EMAILS === 'true'
    : (process.env.NODE_ENV === 'development');

  if (devEnabled) {
    try {
      await developmentTransporter.verify();
      console.log('✅ Development mail transporter (MailDev) ready ( %s:%s )', devHost, devPort);
    } catch (err) {
      console.warn('⚠️ Development mail transporter verification failed:', err && err.message ? err.message : err);
    }
  }
})();

// Control which targets to send emails to. Options for EMAIL_SEND_TARGET: 'both' | 'production' | 'development' | 'none'
// Sensible defaults:
// - In development (NODE_ENV=development) we default to sending only to MailDev (no real emails).
// - In other envs we default to sending to both (production + dev) unless overridden.
const _envTarget = (process.env.EMAIL_SEND_TARGET || '').toLowerCase();
// Default target: in development -> development, in production -> production, otherwise both
const EMAIL_SEND_TARGET = _envTarget || (process.env.NODE_ENV === 'development' ? 'development' : (process.env.NODE_ENV === 'production' ? 'production' : 'both'));

// Flags to explicitly enable/disable real/dev sends. If not provided, use NODE_ENV defaults.
const SEND_REAL_EMAILS = typeof process.env.SEND_REAL_EMAILS !== 'undefined'
  ? process.env.SEND_REAL_EMAILS === 'true'
  : (process.env.NODE_ENV === 'development' ? false : true);

// Default: enable dev emails only in development; in production dev emails are disabled by default
const SEND_DEV_EMAILS = typeof process.env.SEND_DEV_EMAILS !== 'undefined'
  ? process.env.SEND_DEV_EMAILS === 'true'
  : (process.env.NODE_ENV === 'development' ? true : false);

// Log chosen behaviour for clarity
console.log(`[MailService] EMAIL_SEND_TARGET=${EMAIL_SEND_TARGET}, SEND_REAL_EMAILS=${SEND_REAL_EMAILS}, SEND_DEV_EMAILS=${SEND_DEV_EMAILS}, NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);


/**
 * Generate and send a confirmation code via email to both production and development environments
 * @param {string} email - Recipient email address
 * @param {string} prenom - First name of the recipient
 * @param {string} nom - Last name of the recipient
 * @returns {Promise<string>} The generated confirmation code
 * @throws {Error} If both email sending attempts fail
 */
async function sendConfirmationCode(email, prenom, nom) {
  const logger = (level, message) => console[level](`[MailService] ${message}`);
  logger('log', `Preparing confirmation code for ${email}`);

  // Generate 6-digit confirmation code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store code in Redis (best-effort). If Redis is not available, continue and still send emails.
  try {
    // node-redis v4 exposes `isOpen` to check connection state
    if (!redisClient.isOpen) {
      logger('log', 'Redis client not connected - attempting to connect...');
      try {
        await redisClient.connect();
        logger('log', 'Redis client connected');
      } catch (connectErr) {
        logger('warn', `Redis connect failed: ${connectErr && connectErr.message ? connectErr.message : connectErr}`);
      }
    }

    if (redisClient.isOpen) {
      await redisClient.setEx(`confirmation-code:${email}`, CONFIRMATION_CODE_EXPIRY, code);
      logger('log', 'Confirmation code stored in Redis');
    } else {
      logger('warn', 'Redis unavailable, skipping storing confirmation code');
    }
  } catch (err) {
    // Log error but do not prevent email delivery
    logger('error', `Redis storage failed: ${err && err.message ? err.message : err}`);
  }

  // Prepare email content
  const emailContent = {
    to: email,
    subject: 'Votre code de confirmation CareFlow',
    html: `
      <p>Bonjour ${prenom || ''} ${nom || ''},</p>
      <p>Votre code de confirmation est : <b>${code}</b></p>
      <p>Ce code expirera dans ${CONFIRMATION_CODE_EXPIRY / 60} minutes.</p>
    `
  };

  // Decide targets based on environment flags
  const sendPromises = [];

  // Helper wrappers so logging happens consistently
  const sendProduction = () => productionTransporter.sendMail({ ...emailContent, from: fromEnv })
    .then(info => { logger('log', `Production email sent to ${email} (messageId=${info.messageId})`); return info; });

  const sendDevelopment = () => developmentTransporter.sendMail({ ...emailContent, from: process.env.DEV_EMAIL_FROM || 'development@careflow.local' })
    .then(info => { logger('log', `Development email sent to ${email} (messageId=${info.messageId})`); return info; });

  // Determine which sends to perform
  if (EMAIL_SEND_TARGET === 'both' || EMAIL_SEND_TARGET === 'production') {
    if (SEND_REAL_EMAILS) sendPromises.push(sendProduction());
    else logger('log', 'SEND_REAL_EMAILS is false — skipping production send');
  }

  if (EMAIL_SEND_TARGET === 'both' || EMAIL_SEND_TARGET === 'development') {
    if (SEND_DEV_EMAILS) sendPromises.push(sendDevelopment());
    else logger('log', 'SEND_DEV_EMAILS is false — skipping development send');
  }

  if (EMAIL_SEND_TARGET === 'none') {
    logger('warn', 'EMAIL_SEND_TARGET is "none" — no email will be sent');
  }

  if (sendPromises.length === 0) {
    // No targets to send to — treat as failure
    logger('error', 'No email transporters configured to send (check EMAIL_SEND_TARGET / SEND_REAL_EMAILS / SEND_DEV_EMAILS)');
    throw new Error('No email transporters configured to send');
  }

  const sendResults = await Promise.allSettled(sendPromises);

  // Check results
  const succeeded = sendResults.some(result => result.status === 'fulfilled');
  const errors = sendResults
    .filter(result => result.status === 'rejected')
    .map(result => (result.reason && result.reason.message) ? result.reason.message : String(result.reason));

  if (!succeeded) {
    logger('error', `Failed to send emails: ${errors.join(', ')}`);
    // Log full sendResults for debugging (stack traces / reasons)
    try {
      const debugInfo = sendResults.map(r => ({ status: r.status, reason: r.reason && (r.reason.message || r.reason.code || String(r.reason)) }));
      logger('error', `Send results detail: ${JSON.stringify(debugInfo)}`);
    } catch (jErr) {
      logger('error', 'Failed to stringify sendResults for debug: ' + (jErr && jErr.message ? jErr.message : jErr));
    }
    throw new Error('Failed to send confirmation email in both environments');
  }

  return code;
}

/**
 * Verify if the provided confirmation code matches the stored one
 * @param {string} email - Email address to verify code for
 * @param {string} code - Code to verify
 * @returns {Promise<boolean>} Whether the code is valid
 */
async function verifyConfirmationCode(email, code) {
  try {
    const stored = await redisClient.get(`confirmation-code:${email}`);
    return Boolean(stored && stored === code);
  } catch (err) {
    console.error(`[MailService] Failed to verify code: ${err.message}`);
    return false;
  }
}

/**
 * Clear the stored confirmation code for an email
 * @param {string} email - Email address to clear code for
 * @returns {Promise<void>}
 */
async function clearConfirmationCode(email) {
  try {
    await redisClient.del(`confirmation-code:${email}`);
  } catch (err) {
    console.error(`[MailService] Failed to clear code: ${err.message}`);
  }
}

// Export service functions
module.exports = {
  sendConfirmationCode,
  verifyConfirmationCode,
  clearConfirmationCode,
};
