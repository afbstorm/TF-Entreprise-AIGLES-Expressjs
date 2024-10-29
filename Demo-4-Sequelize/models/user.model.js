module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // Définition de l'id auto-incrémenté
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Identifiant unique auto-incrémenté du user",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // Vérifie que le nom n'est pas vide
          notEmpty: {
            msg: "Le nom ne peut pas être vide",
          },
          // Vérifie la longueur du nom
          len: {
            args: [2, 50],
            msg: "Le nom doit contenir entre 2 et 50 caractères",
          },
        },
        comment: "Nom du user",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "L'email ne peut pas être vide",
          },
          isEmail: {
            msg: "Format invalide",
          },
        },
        comment: "Adresse email du user",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le mot de passe ne doit pas être vide",
          },
          len: {
            args: [6, 100],
            msg: "Le mot de passe doit avoir entre 6 et 100 caractères",
          },
        },
        comment: "Mot de passe du user",
      },
    },
    {
      // options du model
      defaultScope: {
        // Exclure automatiquement (par défaut) le mot de passe des queries
        attributes: {
          exclude: ["password"],
        },
      },
      // timestamps: true // ajoute automatiquement le createdAt et updatedAt
    }
  );

  /**
   * @param {Object} models - Les différents models de la db
   * One-to-Many (voir code pour exemple)
   *
   * Utilise hasMany d'un côté
   * Utilise belongsTo de l'autre
   * Crée une clé étrangère dans la table many
   * Définit comme : un auteur a plusieurs articles
   *
   * Many-to-One
   *
   * L'inverse de la One-To-Many
   *
   * Many-to-Many
   *
   * Utilise belongsTo dans les deux models
   * Création d'une table de jointure (table intermédiaire) via la clé ' through '
   * Clés étrangères seront stockées dans la table de jointure
   *
   */

  User.associate = (models) => {
    // Association one-to-many
    User.hasMany(models.Article, {
      foreignKey: "authorId", // Création de la clé étrangère dans la table Article
      as: "articles", // Alias pour les queries
    });
  };

  return User;
};

/* 

sequelize.define('NOMDETABLE', {
    nomDeColonne: {
        attributsDeColonne
    },
    nomDeColonne2: {
        ...
    }
})

*/
