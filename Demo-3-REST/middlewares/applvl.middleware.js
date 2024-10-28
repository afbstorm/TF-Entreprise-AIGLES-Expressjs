const appLvlMiddleware = (req, res, next) => {
  console.log(`Requête partie à ${new Date().toLocaleDateString(
    "fr"
  )} sur l'url 
    ${req.url} avec la méthode ${req.method}`);

  // Pour continuer la requête on utilise next(), sinon, la requête reste bloquée
  // dans le middleware
  next();
};

module.exports = appLvlMiddleware;
