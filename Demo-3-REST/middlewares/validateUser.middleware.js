const validateUserMiddleware = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.length < 3) {
    // Status code 400 : erreur côté client (par exemple : syntaxe incorrecte)
    return res
      .status(400)
      .json({ error: "Le nom doit faire plus de 3 caractères" });
  }

  next();
};

// On peut modifier le nom des exports, en créant un object key/value
module.exports = { validateUser: validateUserMiddleware };
