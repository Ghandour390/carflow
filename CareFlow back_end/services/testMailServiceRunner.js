const MailService = require('./MailService');

(async () => {
  const target = process.argv[2] || 'isamchajia@gmail.com';
  console.log(`ℹ️ testMailServiceRunner: sending test confirmation to ${target}`);
  try {
    const code = await MailService.sendConfirmationCode(target, 'Test', 'Runner');
    console.log('✅ MailService sendConfirmationCode returned code:', code);
  } catch (err) {
    console.error('❌ MailService test failed:', err && err.message ? err.message : err);
    if (err && err.response) console.error('SMTP response:', err.response);
  }
})();
