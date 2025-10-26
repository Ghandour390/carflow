const Notification = require('../models/Notification');
const MailService = require('./MailService');
const User = require('../models/User');

class NotificationService {
    async createNotification(utilisateurId, message) {
        try {
            const notification = new Notification({
                utilisateurId,
                message
            });
            return await notification.save();
        } catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
            throw error;
        }
    }

    async sendRendezVousNotification(rendezVous, type) {
        try {
            const medecin = await User.findById(rendezVous.medecinId);
            const patient = await User.findById(rendezVous.patientId);

            if (!medecin || !patient) {
                throw new Error("Médecin ou patient non trouvé");
            }

            let message;
            let emailSubject;
            let emailContent;

            switch (type) {
                case 'reservation':
                    // Notification pour le médecin
                    message = `Nouveau rendez-vous : ${patient.prenom} ${patient.nom} souhaite prendre un rendez-vous le ${rendezVous.date} à ${rendezVous.heureDebut}. Veuillez confirmer ou annuler.`;
                    await this.createNotification(medecin._id, message);

                    emailSubject = 'Nouvelle demande de rendez-vous';
                    emailContent = `
                        <h2>Nouvelle demande de rendez-vous</h2>
                        <p>Bonjour Dr. ${medecin.prenom} ${medecin.nom},</p>
                        <p>${patient.prenom} ${patient.nom} souhaite prendre un rendez-vous:</p>
                        <p>Date: ${new Date(rendezVous.date).toLocaleDateString('fr-FR')}</p>
                        <p>Heure: ${rendezVous.heureDebut}</p>
                        <p>Veuillez vous connecter à votre compte pour confirmer ou annuler ce rendez-vous.</p>
                    `;
                    break;

                case 'confirmation':
                    // Notification pour le patient
                    message = `Votre rendez-vous avec Dr. ${medecin.prenom} ${medecin.nom} le ${rendezVous.date} à ${rendezVous.heureDebut} a été confirmé.`;
                    await this.createNotification(patient._id, message);

                    emailSubject = 'Confirmation de votre rendez-vous';
                    emailContent = `
                        <h2>Confirmation de rendez-vous</h2>
                        <p>Bonjour ${patient.prenom} ${patient.nom},</p>
                        <p>Votre rendez-vous a été confirmé:</p>
                        <p>Médecin: Dr. ${medecin.prenom} ${medecin.nom}</p>
                        <p>Date: ${new Date(rendezVous.date).toLocaleDateString('fr-FR')}</p>
                        <p>Heure: ${rendezVous.heureDebut}</p>
                    `;
                    break;

                case 'annulation_medecin':
                    // Notification pour le patient
                    message = `Votre rendez-vous avec Dr. ${medecin.prenom} ${medecin.nom} le ${rendezVous.date} à ${rendezVous.heureDebut} a été annulé par le médecin.`;
                    await this.createNotification(patient._id, message);

                    emailSubject = 'Annulation de votre rendez-vous';
                    emailContent = `
                        <h2>Annulation de rendez-vous</h2>
                        <p>Bonjour ${patient.prenom} ${patient.nom},</p>
                        <p>Votre rendez-vous a été annulé par le médecin:</p>
                        <p>Médecin: Dr. ${medecin.prenom} ${medecin.nom}</p>
                        <p>Date: ${new Date(rendezVous.date).toLocaleDateString('fr-FR')}</p>
                        <p>Heure: ${rendezVous.heureDebut}</p>
                        <p>Vous pouvez reprendre un nouveau rendez-vous sur notre plateforme.</p>
                    `;
                    break;

                case 'annulation_patient':
                    // Notification pour le médecin
                    message = `Le rendez-vous avec ${patient.prenom} ${patient.nom} le ${rendezVous.date} à ${rendezVous.heureDebut} a été annulé par le patient.`;
                    await this.createNotification(medecin._id, message);

                    emailSubject = 'Annulation d\'un rendez-vous par le patient';
                    emailContent = `
                        <h2>Annulation de rendez-vous</h2>
                        <p>Bonjour Dr. ${medecin.prenom} ${medecin.nom},</p>
                        <p>Le rendez-vous suivant a été annulé par le patient:</p>
                        <p>Patient: ${patient.prenom} ${patient.nom}</p>
                        <p>Date: ${new Date(rendezVous.date).toLocaleDateString('fr-FR')}</p>
                        <p>Heure: ${rendezVous.heureDebut}</p>
                    `;
                    break;
            }

            // Envoyer l'email
            if (emailSubject && emailContent) {
                if (type === 'reservation' || type === 'annulation_patient') {
                    await MailService.sendEmail(medecin.email, emailSubject, emailContent, medecin.prenom, medecin.nom);
                } else {
                    await MailService.sendEmail(patient.email, emailSubject, emailContent, patient.prenom, patient.nom);
                }
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            throw error;
        }
    }

    async marquerCommeLue(notificationId) {
        try {
            return await Notification.findByIdAndUpdate(
                notificationId,
                { estLu: true },
                { new: true }
            );
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification:', error);
            throw error;
        }
    }

    async getNotificationsUtilisateur(utilisateurId) {
        try {
            return await Notification.find({ utilisateurId })
                .sort({ dateCreation: -1 });
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();