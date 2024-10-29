const express = require('express');
const routes = require('./router');
const db = require('./models');

const app = express();
app.use(express.json());

app.use('/api', routes);

const PORT = 3000;
db.sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    });
