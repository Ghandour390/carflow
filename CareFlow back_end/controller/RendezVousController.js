const RendezVous = require('../models/RendezVous');
const Disponibilite = require('../models/Disponibilite');
const moment = require('moment');
const User = require('../models/User');

// medecinId date heureDebut heureFin  statut patientId
class RendezVousController{
    
async generateSlots(req, res) {
  try {
    const { medecinId, jour, heureFin, heureDebut, dureeSlot } = req.body;
    const slots = [];
    const start = moment(heureDebut, 'HH:mm');
    const end = moment(heureFin, 'HH:mm');

    const existing = await Disponibilite.findOne({
      medecinId,
      date: moment().day(jour).startOf("day").toDate(),
    });

    if (existing) {
      return res.status(400).json({ msg: "Slots deja generés pour ce jour" });
    }

    const disponibilite = await Disponibilite.create({
      medecinId,
      date: moment().day(jour).toDate(),
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
        date: moment().day(jour).toDate(),
        statut: 'disponible',
      });
      start.add(dureeSlot, 'minutes');
    }

    const disponibilites = await RendezVous.insertMany(slots);
    res.status(201).json({ msg: "Slots generés avec succès", slots: disponibilites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};


    async getDesponibilitesByMedecin(req,res){
        try {
            const { medecinId } = req.params;
            const medecin = await User.findById(medecinId);
            if(!medecin){
                return res.status(404).json({ msg: "Medecin not found" });
            }
            const disponibilites = await RendezVous.find({ medecinId: medecinId , statut: 'disponible'});
            res.status(200).json(disponibilites);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    async getDisponibilitesByMedecinAndDate(req, res){
        try {
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
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    async getDisponibilitesByDate(req , res){
        try {
            const { date } = req.params;
            const startOfDay = moment(date).startOf('day').toDate();
            const endOfDay = moment(date).endOf('day').toDate();

            const disponibilites = await RendezVous.find({
                date: { $gte: startOfDay, $lte: endOfDay },
                statut: 'disponible'
            });
            res.status(200).json(disponibilites);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" ,error:error});
        }
    };

    async getRendezVousByPatient(req, res){
        try {
            const { patientId } = req.params || req.user.id;
            const rendezVous = await RendezVous.find({ patientId: patientId });
            res.status(200).json(rendezVous);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    async reserverRendezVous(req, res) {
        try {
            const { disponibiliteId } = req.params;
            const { patientId } = req.body;
            
            const disponibilite = await RendezVous.findById(disponibiliteId);
            if (!disponibilite) {
                return res.status(404).json({ msg: "Disponibilité non trouvée" });
            }
            if (disponibilite.statut === 'reserve') {
                return res.status(400).json({ msg: "Ce créneau est déjà réservé" });
            }
            
           
              disponibilite.patientId =  patientId;
            
                disponibilite.statut = 'en_attente';
       
            disponibilite.save();
            const rendezVous = disponibilite;
            
            res.status(201).json({ msg: "Rendez-vous réservé avec succès", rendezVous });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async anulluerRendezVous(req, res){
        try {
            const { id } = req.params;
            const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'annule' }, { new: true });
            res.status(200).json({ msg: "Rendez-vous annulé avec succès",rendezVous });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    async ConfirmerRendezVous(req, res){
        try {
            const { id } = req.params;
            const rendezVous = await RendezVous.findByIdAndUpdate(id, { statut: 'confirme' }, { new: true });
            res.status(200).json({ msg: "Rendez-vous confirmé avec succès",rendezVous });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    
}
module.exports = new RendezVousController();
