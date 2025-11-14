
const jwt = require("jsonwebtoken");
const { getCachedUser, cacheUser } = require('../utils/userCache');
const User = require('../models/User');
const redisClient = require('../config/redis');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers['x-refresh-token'];

  if (!authHeader) {
    return res.status(401).json({ message: "Aucun token fourni" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await getCachedUser(decoded.id);

    if (!user) {
      user = await User.findById(decoded.id);
      if (user) {
        await cacheUser(decoded.id, user.toObject());
      } else {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }
    }

    req.user = {
      ...decoded,
      ...user,
      id: decoded.id 
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redisClient.get(`refresh:${decodedRefresh.id}`);

        if (storedToken === refreshToken) {
          const user = await User.findById(decodedRefresh.id);
          if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
          }

          const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
          
          res.setHeader('X-New-Access-Token', newAccessToken);
          
          req.user = {
            id: user._id,
            role: user.role,
            ...user.toObject()
          };
          
          return next();
        }
      } catch {
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }
    }
    
    console.error('❌ Erreur de vérification du token:', error);
    res.status(403).json({ message: "Token invalide ou expiré", error: error.message });
  }
};

module.exports = verifyToken;
