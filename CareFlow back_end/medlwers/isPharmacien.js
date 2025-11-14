const { User } = require('../models/User');
const { getCachedUser, cacheUser } = require('../utils/userCache');

const isPharmacien = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let user = null;

        user = await getCachedUser(userId);

        if (!user) {
            user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non trouvé." });
            }   
            await cacheUser(userId, user.toObject());
        }

        if (user.role !== 'pharmacien') {
            return res.status(403).json({ msg: "Accès refusé. Rôle de pharmacien requis." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ msg: "Erreur lors de la vérification du rôle de pharmacien." });
    }
};

module.exports = isPharmacien;

