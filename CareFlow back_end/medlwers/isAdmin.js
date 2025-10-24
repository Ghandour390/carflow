
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: "Accès refusé : privilèges administrateur requis." });
    }
};

module.exports = isAdmin;