const { User, Article } = require("../models");
const { Op } = require("sequelize");
const sanitizeInput = require("../utils/sanitize");

/*

LEFT JOIN : required: false
RIGHT JOIN : right: true
INNER JOIN : required: true

*/

const userController = {
  findAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          // Lors de l'appel de la méthode findAll, le password sera TOUJOURS exclu
          exclude: ["password"],
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error(`Erreur lors du findAll : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  create: async (req, res) => {
    try {
      // Nettoyage des données utilisateur
      const sanitizedData = sanitizeInput(req.body, ["name", "email", "password"]);

      // Création de l'utilisateur
      const user = await User.create(sanitizedData);

      const { password, ...userWithoutPassword } = user.toJSON();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error(`Erreur lors de la création du user : ${error}`);
      // Gestion des erreurs de validation du model User
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      // Gestion d'erreurs d'unicité
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          error: "Contrainte d'unicité non-respectée",
          details: "Cet email est déjà utilisé",
        });
      }

      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  findByPk: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Format d'id incorrect" });
      }

      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Article,
            as: "articles",
            where: { published: true }, // Ne récupère que les articles publiés
            required: false, // false -> LEFT JOIN
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "L'utilisateur n'exist pas" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // http://localhost:3000/api/users/1?upateType=user|article|both
  /**
   * Mettre à jour l'utilisateur et/ou ses articles selon le queryParam reçu
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {string} req.params.id - L'id de l'utilisateur à mettre à jour
   * @param {string} req.query.updateType - Le type d'update à faire ['user', 'article', 'both']
   * @param {Object} req.body - Le corps de le requête (la ou les infos d'update seront situées)
   */
  update: async (req, res) => {
    const { id } = req.params;
    const { updateType } = req.query;
    const updateData = req.body;

    // Arrays d'input autorisés pour l'update
    const ALLOWED_ARTICLE_FIELDS = ["title", "content", "published"];
    const ALLOWED_USER_FIELDS = ["name", "email"];

    try {
      switch (updateType) {
        case "user":
          // Sanitize les données
          const sanitizedUser = sanitizeInput(updateData, ALLOWED_USER_FIELDS);

          // Récupération de l'utilisateur
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).json({ error: "Pas d'utilisateur trouvé" });
          }

          await user.update(sanitizedUser);
          const { password, ...userWithoutPassword } = user.toJSON();
          return res.status(200).json(userWithoutPassword);
        case "article":
          if (!updateData.articleId) {
            return res.status(400).json({
              error: "articleId est requis pour l'update",
            });
          }

          // Recherche et vérification d'appartenance de l'article
          const article = await Article.findOne({
            where: {
              id: updateData.articleId,
              authorId: id,
            },
          });

          if (!article) {
            return res.status(404).json({
              error: "Article inexistant ou l'authorId n'est pas le propriétaire de l'article",
            });
          }

          // Nettoyage (sanitization) des données
          const sanitizedArticle = sanitizeInput(updateData, ALLOWED_ARTICLE_FIELDS);

          await article.update(sanitizedArticle);

          return res.status(200).json(article);
        case "both":
          if (!Array.isArray(updateData.articleIds)) {
            return res.status(400).json({
              error: "articleIds doit être un tableau",
            });
          }

          // Récupération et update de tous les éléments en même temps
          const [userToUpdate, articlesToUpdate] = await Promise.all([
            User.findByPk(id),
            Article.findAll({
              where: {
                authorId: id,
                id: {
                  [Op.in]: updateData.articleIds,
                },
              },
            }),
          ]);

          if (!userToUpdate) {
            return res.status(404).json({ error: "Utilisateur introuvable ou inexistant" });
          }

          // Sanitize les données pour insérer dans des updates multiples
          // Si updateData.user existe : sanitize
          // Sinon, on utilise un objet vide
          const sanitizedUserUpdate = updateData.user ? sanitizeInput(updateData.user, ALLOWED_USER_FIELDS) : {};

          const sanitizedArticleUpdates = {};

          // Pour mettre à jour chaque article
          // Récupérer les données d'update
          // Sanitize les données par rapport aux champs autorisés
          // Les stocker dans l'objet avec l'id comme clé
          Object.keys(updateData.articleUpdates || {}).forEach((articleId) => {
            sanitizedArticleUpdates[articleId] = sanitizeInput(
              updateData.articleUpdates[articleId],
              ALLOWED_ARTICLE_FIELDS
            );
          });

          // Lancer l'exécution des updates en simultanées
          const updateResults = await Promise.all([
            // On update l'utilisateur
            userToUpdate.update(sanitizedUserUpdate),
            // On update le ou les articles
            ...articlesToUpdate.map((article) => article.update(sanitizedArticleUpdates[article.id] || {})),
          ]);

          const [updatedUser, ...updatedArticles] = updateResults;
          console.log(updateResults);

          const { password: pwd, ...userResult } = updatedUser.toJSON();

          return res.status(200).json({
            user: userResult,
            articles: updatedArticles,
          });

        default:
          throw new Error(`${400}, entrée invalide`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'update : ${error}`);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        error: "Erreur lors de l'update",
        details: error.message,
      });
    }
  },
};

module.exports = userController;
