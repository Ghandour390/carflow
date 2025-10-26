
const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Authentification requise" });
        }

        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ 
                msg: "Accès refusé : privilèges administrateur requis.",
                currentRole: req.user.role
            });
        }
    } catch (error) {
        console.error('❌ Erreur de vérification admin:', error);
        res.status(500).json({ msg: "Erreur lors de la vérification des droits administrateur" });
    }
};

module.exports = isAdmin;