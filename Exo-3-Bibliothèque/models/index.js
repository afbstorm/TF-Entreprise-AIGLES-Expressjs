const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const db = {};

// Import manuel des modèles
db.Author = require('./author.model')(sequelize, DataTypes);
db.Book = require('./book.model')(sequelize, DataTypes);

// Configuration des associations
db.Author.hasMany(db.Book, {
    foreignKey: 'authorId',
    as: 'books'
});

db.Book.belongsTo(db.Author, {
    foreignKey: 'authorId',
    as: 'author'
});

// Test de la connexion
sequelize
    .authenticate()
    .then(() => {
        console.log('Connexion à la base de données établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données:', err);
    });

// Ajout de sequelize à l'objet db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
