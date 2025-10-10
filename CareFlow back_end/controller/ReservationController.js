const Reservation = require('../models/Reservation');


class ReservationController{
    async createReservation(req,res){
        try {
            const {startAt, endAt, note, status} = req.body;
            const userId = req.user._id;
            const reservation = new Reservation({
                userId,
                startAt,
                endAt,
                status,
                note
            });
            await reservation.save();
            res.status(201).json({ msg: "Reservation created successfully", reservation });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    async getReservations(req, res){
        try {
            const reservations = await Reservation.find();
            res.status(200).json(reservations);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    }
    async getReservationsByID(req, res){
        try {
            const reservations = await Reservation.find({
                $or: [
                    { userId: req.user._id },
                    {doctorId: req.doctor?._id }
                ]
            });
            res.status(200).json(reservations);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong" });
        }
    };
    
}
module.exports = new ReservationController();