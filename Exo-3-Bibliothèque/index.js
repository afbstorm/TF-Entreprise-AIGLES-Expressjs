const express = require('express');
const routes = require('./router');
const db = require('./models');
const cors = require('cors');

const app = express();

let corsConfig;

// Switch configuration prod / dev
// if (process.env.NODE_ENV === "production") {
//   corsConfig = cors({
//     origin: 'VOTREADRESSESERVEUR',
//     method: ["GET", "POST", "PUT", "PATCH", "DELETE"], // peut être modifier dépendant de la route utilisée, à ce moment là il faut l'utiliser en tant que middleware sur la route en question
//     headers: ['Content-Type', 'Authorization'], // Pareil qu'en haut
//     // autres options...
// })
// } else {
//   corsConfig = cors({
//     origin: '*',
//     method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     headers: ['Content-Type', 'Authorization']
// })
// }

const corsConfigDev = cors({
    origin: '*',
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    headers: ['Content-Type', 'Authorization']
})

const corsConfigProd = cors({
    origin: 'VOTREADRESSESERVEUR',
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"], // peut être modifier dépendant de la route utilisée, à ce moment là il faut l'utiliser en tant que middleware sur la route en question
    headers: ['Content-Type', 'Authorization'], // Pareil qu'en haut
    // autres options...
})

app.use(corsConfigDev); // app.use(corsConfig) avec le conditionnel sur le mode NODE_ENV
app.use(express.json());
app.use('/api', routes);

const PORT = 3000;
db.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    });
