const express = require("express");
const router = require("./router/user");

const app = express();
const PORT = 3000;

// import du middleware application-level
const appLvlMiddleware = require("./middlewares/applvl.middleware");
app.use(appLvlMiddleware);

app.use(express.json());
// utilisation du router
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur : http://localhost:${PORT} ✅`);
});
