const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// Middleware de vérification / authentification du JWT
const authenticateJWT = (req, res, next) => {
  // Récupération du token dans le header d'autorisation
  // Authorization
  const authHeader = req.header("Authorization");
  console.log("Que nous donne le split : ", authHeader && authHeader.split(" "));

  // Format : "Bearer token"
  const token = authHeader && authHeader.split(" ")[1]; // token

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Token manquant" });
  }

  try {
    // Vérification et décodage du token
    const user = jwt.verify(token, SECRET);
    // Si le token est valide et non périmé
    // On stocke les infos utilisateur dans une nouvelle clé de la request
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

// Middleware de vérificatin de rôle utilisateur
// Utilisable uniquement après utilisation du middleware authenticateJWT
const isOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ error: "Accès refusé. Rôle propriétaire (owner) requis" });
  }
  next();
};

module.exports = { authenticateJWT, isOwner };
