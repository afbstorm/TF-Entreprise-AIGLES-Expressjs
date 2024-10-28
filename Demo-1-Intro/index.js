const express = require("express");
const app = express();
const PORT = 3000;

// Fonctionne mais ne fournit pas d'accès aux méthodes d'express ⚠️
// const app = require('express').express();

// On va dire à notre moteur express de parser le json
app.use(express.json());

// Routing basique
app.get("/", (req, res) => {
  //   res.send("Hello World");
  res.json({ message: "Hello je suis un JSON" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT} ✅`);
});
