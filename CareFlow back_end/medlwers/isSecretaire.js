
const secretaire = (req, res, next) => {
    // On vérifie d'abord si l'utilisateur est authentifié et si son rôle est défini
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Authentification requise." });
    }
    const authorizedRoles = ['secretaire', 'medecin', 'infirmier', 'admin'];
    if (authorizedRoles.includes(req.user.role)) {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé. Seul le personnel administratif (secrétaire) est autorisé." });
    }
};
module.exports = secretaire;