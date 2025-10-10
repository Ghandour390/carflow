
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // نستخرج الهيدر Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Aucun token fourni" });
  }

  // الهيدر كيكون على الشكل: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // نخزن معلومات المستخدم
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = verifyToken;
