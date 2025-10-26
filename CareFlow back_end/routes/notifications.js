const express = require('express');
const router = express.Router();
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

const NotificationController = {
    async getNotifications(req, res) {
        try {
            const notifications = await NotificationService.getNotificationsUtilisateur(req.user._id);
            res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération des notifications"
            });
        }
    },

    async marquerCommeLue(req, res) {
        try {
            const notification = await NotificationService.marquerCommeLue(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: "Notification non trouvée" });
            }
            res.status(200).json(notification);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la mise à jour de la notification"
            });
        }
    }
};

router.get('/', verifyToken, isEmailConfirmed, NotificationController.getNotifications);
router.put('/:id/lue', verifyToken, isEmailConfirmed, NotificationController.marquerCommeLue);

module.exports = router;