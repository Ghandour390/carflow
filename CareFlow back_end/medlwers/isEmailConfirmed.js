const User = require('../models/User');
const { getCachedUser, cacheUser } = require('../utils/userCache');

const isEmailConfirmed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let user = null;

        // Essayer d'abord de récupérer l'utilisateur depuis Redis
        user = await getCachedUser(userId);

        // Si l'utilisateur n'est pas dans Redis, le récupérer depuis MongoDB
        if (!user) {
            user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non trouvé." });
            }

            // Stocker l'utilisateur dans Redis pour les prochaines requêtes
            await cacheUser(userId, user.toObject());

        if (!user.isConfirmed) {
            return res.status(403).json({ 
                msg: "Email non confirmé. Veuillez vérifier votre email et confirmer votre compte.",
                requiresConfirmation: true 
            });
        }
    }

        // Ajouter l'utilisateur à la requête pour éviter de le recharger plus tard
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ msg: "Erreur lors de la vérification de la confirmation de l'email." });
    }
};

module.exports = isEmailConfirmed;