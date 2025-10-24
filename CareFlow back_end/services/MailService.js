const nodemailer = require('nodemailer');
const redisClient = require('../config/redis');
require('dotenv').config();



const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
const user = process.env.EMAIL_USER;
const pass = (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '');

const transporterOptions = {
  host,
  port,
};


if (host === 'maildev') {

  transporterOptions.secure = false;
  transporterOptions.ignoreTLS = true;
} else {
  transporterOptions.secure = port === 465;
  if (user && pass) {
    transporterOptions.auth = { user, pass };
  }

  transporterOptions.tls = {

    rejectUnauthorized: false,
  };
}

const transporter = nodemailer.createTransport(transporterOptions);


(async () => {
  try {
    await transporter.verify();
    console.log("✅ Mail transporter ready");
  } catch (err) {
    console.warn("⚠️ Mail transporter verification failed:", err.message || err);
  }
})();


async function sendConfirmationCode(email, prenom, nom) {
  console.log(`ℹ️ sendConfirmationCode: preparing to send code to ${email}`);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redisClient.setEx(`confirmation-code:${email}`, 10 * 60, code);
  } catch (err) {
    console.warn("⚠️ Failed to store confirmation code in Redis:", err.message || err);
  }

  const html = `
    <p>Bonjour ${prenom || ''} ${nom || ''},</p>
    <p>Votre code de confirmation est : <b>${code}</b></p>
    <p>Ce code expirera dans 15 minutes.</p>
  `;

  console.log(`ℹ️ sendConfirmationCode: sending email to ${user}`);

  const fromAddress = user;

    console.log(`ℹ️ Sending confirmation email from ${fromAddress} -> ${email}`);


  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Votre code de confirmation CareFlow',
      html,
    });

    console.log(`✉️ Confirmation email sent to ${email} (messageId=${info.messageId})`);
  } catch (err) {
    console.error("❌ Failed to send confirmation email:", err.message || err);
    throw err;
  }

  return code;
}

async function verifyConfirmationCode(email, code) {
  const stored = await redisClient.get(`confirmation-code:${email}`);
  return stored && stored === code;
}

async function clearConfirmationCode(email) {
  await redisClient.del(`confirmation-code:${email}`);
}

module.exports = {
  sendConfirmationCode,
  verifyConfirmationCode,
  clearConfirmationCode
};
