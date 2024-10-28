const express = require("express");
// Import du routeur
const router = require("./router/tasks");

const app = express();
const PORT = 3000;

app.use(express.json());
// Instruction a l'app pour utiliser le router
app.use(router);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT} ✅`);
});
