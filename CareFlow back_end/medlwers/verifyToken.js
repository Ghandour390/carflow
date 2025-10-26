
const jwt = require("jsonwebtoken");
const { getCachedUser, cacheUser } = require('../utils/userCache');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Aucun token fourni" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Essayer de récupérer l'utilisateur depuis le cache Redis
    let user = await getCachedUser(decoded.id);

    // Si non trouvé dans le cache, chercher dans MongoDB
    if (!user) {
      user = await User.findById(decoded.id);
      if (user) {
        // Mettre en cache pour les prochaines requêtes
        await cacheUser(decoded.id, user.toObject());
      } else {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }
    }

    // Ajouter les informations complètes de l'utilisateur à la requête
    req.user = {
      ...decoded,
      ...user,
      id: decoded.id // Garder l'ID du token pour la cohérence
    };
    
    next();
  } catch (error) {
    console.error('❌ Erreur de vérification du token:', error);
    res.status(403).json({ message: "Token invalide ou expiré", error: error.message });
  }
};

module.exports = verifyToken;
