const reservationcontroller = require('../controller/ReservationController');
const express = require('express');
const router = express.Router();




router.post('/', reservationcontroller.createReservation);
router.get('/', reservationcontroller.getReservations);
router.get('/:id', reservationcontroller.getReservationsByID);


module.exports = router;