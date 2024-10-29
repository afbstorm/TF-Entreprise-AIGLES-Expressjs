module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("Article", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Identifiant de l'article",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le titre ne doit pas être vide",
        },
        len: {
          args: [3, 100],
          msg: "Le titre doit avoir entre 3 et 100 caractères",
        },
      },
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "L'article doit avoir un contenu",
        },
        len: {
          args: [10, 1000],
          msg: "Le contenu doit avoir entre 10 et 1000 caractères",
        },
      },
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Published doit être un booléen");
          }
        },
      },
    },
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: "authorId",
      as: "author",
    });
  };

  return Article;
};
