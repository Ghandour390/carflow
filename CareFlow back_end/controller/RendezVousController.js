const RendezVous = require('../models/RendezVous');
const Disponibilite = require('../models/Disponibilite');
const moment = require('moment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// medecinId date heureDebut heureFin  statut patientId
class RendezVousController{
    
async generateSlots(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { medecinId, jour, heureFin, heureDebut, dureeSlot } = req.body;
    const slots = [];
    const start = moment(heureDebut, 'HH:mm');
    const end = moment(heureFin, 'HH:mm');

    const now = moment();
    let targetDate = moment().day(jour).startOf('day');


    if (targetDate.isBefore(now.startOf('day'))) {
      targetDate.add(1, 'week');
    }

    if (targetDate.isSame(now, 'day') && start.isBefore(now)) {
      return res.status(400).json({ msg: "L'heure de début ne peut pas être dans le passé pour un rendez-vous aujourd'hui." });
    }


    const existing = await Disponibilite.findOne({
      medecinId,
      date: targetDate.toDate(),
    });

    if (existing) {
      return res.status(400).json({ msg: "Slots deja generés pour ce jour" });
    }
    const disponibilite = await Disponibilite.create({
      medecinId,
      date: targetDate.toDate(),
      heureDebut,
      heureFin,
    });

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

    const disponibilites = await RendezVous.insertMany(slots);
    res.status(201).json({ msg: "Slots generés avec succès", slots: disponibilites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erreur serveur lors de la génération des créneaux" });
  }
};


    async getDisponibilitesByMedecin(req,res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { medecinId } = req.params;
            const medecin = await User.findById(medecinId);
            if(!medecin){
                return res.status(404).json({ msg: "Medecin not found" });
            }
            const disponibilites = await RendezVous.find({ medecinId: medecinId , statut: 'disponible'});
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des disponibilités" });
        }
    };
    async getDisponibilitesByMedecinAndDate(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { medecinId, date } = req.params;
            const startOfDay = moment(date).startOf('day').toDate();
            const endOfDay = moment(date).endOf('day').toDate();

            const disponibilites = await RendezVous.find({
                medecinId: medecinId,
                date: { $gte: startOfDay, $lte: endOfDay },
                statut: 'disponible'
            });
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des disponibilités" });
        }
    };
    async getDisponibilitesByDate(req , res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { date } = req.params;
            const startOfDay = moment(date).startOf('day').toDate();
            const endOfDay = moment(date).endOf('day').toDate();

            const disponibilites = await RendezVous.find({
                date: { $gte: startOfDay, $lte: endOfDay },
                statut: 'disponible'
            });
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des disponibilités" });
        }
    };

    async getRendezVousByPatient(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { patientId } = req.params;
            const rendezVous = await RendezVous.find({ patientId: patientId });
            res.status(200).json(rendezVous);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des rendez-vous" });
        }
    };
    async reserverRendezVous(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { disponibiliteId } = req.params;
            const { patientId } = req.body;
            
            const patient = await User.findById(patientId);
            if (!patient) {
                return res.status(404).json({ msg: "Patient non trouvé" });
            }

            const disponibilite = await RendezVous.findById(disponibiliteId);
            if (!disponibilite) {
                return res.status(404).json({ msg: "Disponibilité non trouvée" });
            }
            if (disponibilite.statut !== 'disponible') {
                return res.status(400).json({ msg: "Ce créneau est déjà réservé" });
            }
            
      
            const startOfDay = moment(disponibilite.date).startOf('day').toDate();
            const endOfDay = moment(disponibilite.date).endOf('day').toDate();

            const existingRendezVous = await RendezVous.findOne({
                patientId,
                date: { $gte: startOfDay, $lte: endOfDay },
                statut: { $in: ['en_attente', 'confirme'] }
            });

            if (existingRendezVous) {
                return res.status(400).json({ msg: "Ce patient a déjà un rendez-vous prévu pour ce jour." });
            }
   

            disponibilite.patientId = patientId;
            disponibilite.statut = 'en_attente';
       
            await disponibilite.save();
            
            res.status(200).json({ msg: "Rendez-vous réservé avec succès", rendezVous: disponibilite });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la réservation du rendez-vous" });
        }
    }
    async anulluerRendezVous(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'annule' }, { new: true });
            res.status(200).json({ msg: "Rendez-vous annulé avec succès",rendezVous });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de l'annulation du rendez-vous" });
        }
    };
    async ConfirmerRendezVous(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'confirme' }, { new: true });
            if (!rendezVous) {
                return res.status(404).json({ msg: "Rendez-vous non trouvé" });
            }
            res.status(200).json({ msg: "Rendez-vous confirmé avec succès",rendezVous });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la confirmation du rendez-vous" });
        }
    };
    
    async annulerRendezVousPatient(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { patientId } = req.body;

            const rendezVous = await RendezVous.findById(id);

            if (!rendezVous) {
                return res.status(404).json({ msg: "Rendez-vous non trouvé" });
            }

            // Vérification d'autorisation : le rendez-vous appartient-il au patient ?
            if (rendezVous.patientId.toString() !== patientId) {
                return res.status(403).json({ msg: "Action non autorisée. Ce rendez-vous ne vous appartient pas." });
            }

            rendezVous.statut = 'annule';
            await rendezVous.save();

            res.status(200).json({ msg: "Rendez-vous annulé avec succès", rendezVous });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de l'annulation du rendez-vous" });
        }
    }

    async getRendezVousByMedecin(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { medecinId } = req.params;

            const medecin = await User.findById(medecinId);
            if (!medecin) {
                return res.status(404).json({ msg: "Médecin non trouvé" });
            }

            const rendezVous = await RendezVous.find({
                medecinId: medecinId,
                statut: { $ne: 'disponible' }
            }).populate('patientId', 'prenom nom').sort({ date: -1 });

            res.status(200).json(rendezVous);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des rendez-vous du médecin" });
        }
    }
}
module.exports = new RendezVousController();
