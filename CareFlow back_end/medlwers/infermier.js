const infermier = (req, res, next) => {
    try {
        // On vérifie d'abord si l'utilisateur est authentifié et si son rôle est défini
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Authentification requise." });
        }

        const authorizedRoles = ['infirmier', 'medecin', 'admin'];
        if (authorizedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ 
                message: "Accès refusé. Seul le personnel soignant (médecin, infirmier) est autorisé.",
                currentRole: req.user.role,
                requiredRoles: authorizedRoles
            });
        }
    } catch (error) {
        console.error('❌ Erreur de vérification infirmier:', error);
        res.status(500).json({ message: "Erreur lors de la vérification des droits d'accès" });
    }
};

module.exports = infermier;