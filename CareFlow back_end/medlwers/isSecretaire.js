
const secretaire = (req, res, next) => {
    try {
        // On vérifie d'abord si l'utilisateur est authentifié et si son rôle est défini
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Authentification requise." });
        }

        const authorizedRoles = ['secretaire', 'medecin', 'infirmier', 'admin'];
        if (authorizedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ 
                message: "Accès refusé. Seul le personnel administratif (secrétaire) est autorisé.",
                currentRole: req.user.role,
                requiredRoles: authorizedRoles
            });
        }
    } catch (error) {
        console.error('❌ Erreur de vérification secrétaire:', error);
        res.status(500).json({ message: "Erreur lors de la vérification des droits d'accès" });
    }
};
module.exports = secretaire;