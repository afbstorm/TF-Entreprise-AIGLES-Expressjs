const express = require("express");
const router = require("./router");
const db = require("./models");

const app = express();
const PORT = 3000;

// Switch configuration prod / dev
// if (process.env.NODE_ENV === "production") {
//   console.log("config szrver prod");
// } else {
//   console.log("config server dev");
// }

app.use(express.json());
app.use("/api", router);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Connection DB et lancement serveur effectifs ✅`);
  });
});
