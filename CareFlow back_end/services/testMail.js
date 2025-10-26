const MailService = require('./MailService');

(async () => {
  try {
    const code = await MailService.sendConfirmationCode('abdelhakghandour6@gmail.com', 'abdelhak', 'ghandour');
    console.log('Code généré:', code);
  } catch (err) {
    console.error('Envoi échoué:', err);
  } finally {
    process.exit(0);
  }
})();
