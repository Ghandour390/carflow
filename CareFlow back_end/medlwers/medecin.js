
const medecin = (req, res, next) => {
    try {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Authentification requise." });
        }

        if (req.user.role === 'medecin' || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ 
                message: "Accès refusé. Seuls les médecins sont autorisés.",
                currentRole: req.user.role,
                requiredRole: 'medecin'
            });
        }
    } catch (error) {
        console.error('❌ Erreur de vérification médecin:', error);
        res.status(500).json({ message: "Erreur lors de la vérification des droits d'accès" });
    }
};

module.exports = medecin;