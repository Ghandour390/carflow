
const medecin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Authentification requise." });
    }

    if (req.user.role !== 'medecin') {
        return res.status(403).json({ message: "Accès refusé. Seuls les médecins sont autorisés." });
    }
    next();
};

module.exports = medecin;