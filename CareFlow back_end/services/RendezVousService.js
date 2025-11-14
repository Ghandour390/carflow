const RendezVous = require('../models/RendezVous');
const Disponibilite = require('../models/Disponibilite');
const User = require('../models/User');
const moment = require('moment');
const NotificationService = require('./NotificationService');

class RendezVousService {
    async generateSlots({ medecinId, jour, heureFin, heureDebut, dureeSlot }) {
        const start = moment(heureDebut, 'HH:mm');
        const end = moment(heureFin, 'HH:mm');
        const now = moment();
        let targetDate = moment().day(jour).startOf('day');

        if (targetDate.isBefore(now.startOf('day'))) {
            targetDate.add(1, 'week');
        }

        if (targetDate.isSame(now, 'day') && start.isBefore(now)) {
            const error = new Error("L'heure de début ne peut pas être dans le passé pour un rendez-vous aujourd'hui.");
            error.statusCode = 400;
            throw error;
        }

        const existing = await Disponibilite.findOne({
            medecinId,
            date: targetDate.toDate(),
        });

        if (existing) {
            const error = new Error("Des créneaux ont déjà été générés pour ce jour.");
            error.statusCode = 400;
            throw error;
        }

        await Disponibilite.create({
            medecinId,
            date: targetDate.toDate(),
            heureDebut,
            heureFin,
        });

        const slots = [];
        while (start.isBefore(end)) {
            const next = start.clone().add(dureeSlot, 'minutes');
            if (next.isAfter(end)) break;
            slots.push({
                heureDebut: start.format('HH:mm'),
                heureFin: next.format('HH:mm'),
                medecinId,
                date: targetDate.toDate(),
                statut: 'disponible',
            });
            start.add(dureeSlot, 'minutes');
        }

        return RendezVous.insertMany(slots);
    }

    async getDisponibilitesByMedecin(medecinId) {
        const medecin = await User.findById(medecinId);
        if (!medecin) {
            const error = new Error("Médecin non trouvé");
            error.statusCode = 404;
            throw error;
        }
        return RendezVous.find({ medecinId: medecinId, statut: 'disponible' });
    }

    async getDisponibilitesByMedecinAndDate(medecinId, date) {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();
        return RendezVous.find({
            medecinId: medecinId,
            date: { $gte: startOfDay, $lte: endOfDay },
            statut: 'disponible'
        });
    }

    async getDisponibilitesByDate(date) {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();
        return RendezVous.find({
            date: { $gte: startOfDay, $lte: endOfDay },
            statut: 'disponible'
        });
    }

    async getRendezVousByPatient(patientId) {
        return RendezVous.find({ patientId: patientId });
    }

    async reserverRendezVous(disponibiliteId, patientId) {
        const patient = await User.findById(patientId);
        if (!patient) {
            const error = new Error("Patient non trouvé");
            error.statusCode = 404;
            throw error;
        }

        const disponibilite = await RendezVous.findById(disponibiliteId);
        if (!disponibilite) {
            const error = new Error("Disponibilité non trouvée");
            error.statusCode = 404;
            throw error;
        }
        if (disponibilite.statut !== 'disponible') {
            const error = new Error("Ce créneau est déjà réservé");
            error.statusCode = 400;
            throw error;
        }

        const startOfDay = moment(disponibilite.date).startOf('day').toDate();
        const endOfDay = moment(disponibilite.date).endOf('day').toDate();
        const existingRendezVous = await RendezVous.findOne({
            patientId,
            date: { $gte: startOfDay, $lte: endOfDay },
            statut: { $in: ['en_attente', 'confirme'] }
        });

        if (existingRendezVous) {
            const error = new Error("Ce patient a déjà un rendez-vous prévu pour ce jour.");
            error.statusCode = 400;
            throw error;
        }

        disponibilite.patientId = patientId;
        disponibilite.statut = 'en_attente';
        const rendezVousSaved = await disponibilite.save();

        // Envoyer une notification au médecin
        // await NotificationService.sendRendezVousNotification(rendezVousSaved, 'reservation');

        return rendezVousSaved;
    }

    async anulluerRendezVous(id) {
        const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'annule' }, { new: true });
        if (!rendezVous) {
            const error = new Error("Rendez-vous non trouvé");
            error.statusCode = 404;
            throw error;
        }

        // Envoyer une notification au patient
        await NotificationService.sendRendezVousNotification(rendezVous, 'annulation_medecin');

        return rendezVous;
    }

    async confirmerRendezVous(id) {
        const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'confirme' }, { new: true });
        if (!rendezVous) {
            const error = new Error("Rendez-vous non trouvé");
            error.statusCode = 404;
            throw error;
        }

        // Envoyer une notification au patient
        await NotificationService.sendRendezVousNotification(rendezVous, 'confirmation');

        return rendezVous;
    }

    async annulerRendezVousPatient(id, patientId) {
        const rendezVous = await RendezVous.findById(id);
        if (!rendezVous) {
            const error = new Error("Rendez-vous non trouvé");
            error.statusCode = 404;
            throw error;
        }
        if (rendezVous.patientId.toString() !== patientId) {
            const error = new Error("Action non autorisée. Ce rendez-vous ne vous appartient pas.");
            error.statusCode = 403;
            throw error;
        }
        rendezVous.statut = 'annule';
        const rendezVousSaved = await rendezVous.save();

        // Envoyer une notification au médecin
        await NotificationService.sendRendezVousNotification(rendezVousSaved, 'annulation_patient');

        return rendezVousSaved;
    }

    async getRendezVousByMedecin(medecinId) {
        const medecin = await User.findById(medecinId);
        if (!medecin) {
            const error = new Error("Médecin non trouvé");
            error.statusCode = 404;
            throw error;
        }
        return RendezVous.find({
            medecinId: medecinId,
            statut: { $ne: 'disponible' }
        }).populate('patientId', 'prenom nom').sort({ date: -1 });
    }
}

module.exports = new RendezVousService();