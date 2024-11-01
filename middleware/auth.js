const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide" });
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.roles.includes("ROLE_ADMIN")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Accès refusé : Administrateurs uniquement" });
  }
};

module.exports = { authenticateToken, checkAdmin };
