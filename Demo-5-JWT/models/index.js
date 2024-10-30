const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database");

const sequelize = new Sequelize(config);

const db = {};

// Lecture du dossier à la recherche de fichiers servant de models
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Récupération et configuration des associations
Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

// Ajout de l'instance sequelize
db.sequelize = sequelize;
// Ajout de la Class Sequelize
db.Sequelize = Sequelize;

module.exports = db;
