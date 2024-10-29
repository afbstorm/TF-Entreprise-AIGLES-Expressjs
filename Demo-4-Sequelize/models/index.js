// fs = module interne à nodejs permettant la lecture et écriture de
// fichiers de manière sync ou async
const fs = require("fs");
// path = module interne à nodejs permettant de récupérer les chemins d'accès des fichiers,
// mais aussi de concacténer des éléments de chemins d'accès
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database");

// Création d'une nouvelle instance de Sequelize dans laquelle on va injecter la configuration
const sequelize = new Sequelize(config);

// Création d'un object vide qui va contenir nos models
// Un model est une représentation d'une table de base de données
const db = {};

// Lecture automatique des fichiers de models du dossier courant
fs.readdirSync(__dirname) // __dirname donne le chemin d'accès du dossier courant (le dossier dans lequel se situe le fichier)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Ignore les fichiers cachés (les fichiers cachés commencent généralement par un .)
      file !== "index.js" && // Ignore le fichier index lui même (on est dedans)
      file.slice(-3) === ".js" // On ne prend en compte que les fichiers .js
    );
  })
  .forEach((file) => {
    // Pour chaque fichier qu'on aura trouvé
    // Utiliser path pour construire le chemin d'accès complet du fichier
    // Importer le model grace au chemin construit
    // Initialiser le model avec Sequelize
    // Ajouter le model dans l'object db
    // ./models/+user.model.js
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Maintenant que les models sont injectés dans la configuration db
// on peut configurer leurs associations
Object.keys(db).forEach((model) => {
  // Pour chaque modèle, on vérifie si une association existe
  // on appelle cette association en passant les models en paramètre
  // ce qui permet de définir les relations entre les différents models
  if (db[model].associate) {
    db[model].associate(db);
  }
});

// Ajout de l'instance sequelize dans l'object db
// Permet d'accèder à sequelize depuis n'importe ou a partir du moment ou on importe db
db.sequelize = sequelize;

// On ajoute la classe Sequelize dans l'object db
// Permet d'accèder aux types de la classe
db.Sequelize = Sequelize;

module.exports = db;
