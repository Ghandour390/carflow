const infermier = (req, res, next) => {
    // On vérifie d'abord si l'utilisateur est authentifié et si son rôle est défini
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Authentification requise." });
    }

    const authorizedRoles = ['infirmier', 'medecin', 'admin'];
    if (authorizedRoles.includes(req.user.role)) {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé. Seul le personnel soignant (médecin, infirmier) est autorisé." });
    }
};

module.exports = infermier;