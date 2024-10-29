const express = require("express");
const router = require("./router");
const db = require("./models");

const app = express();
const PORT = 3000;

const initDbConnection = async () => {
  try {
    await db.sequelize.sync({ force: false }); // force définit si a chaque modification de model, la db se recrée
    console.log(`Base de données synchronisée ✅`);
  } catch (error) {
    console.error(`Erreur de synchronisation : ${error}`);
  }
};

initDbConnection();

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});
