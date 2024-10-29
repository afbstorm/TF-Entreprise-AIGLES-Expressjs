const { Article, User } = require("../models");
const sanitizeInput = require("../utils/sanitize");

// Création des arrays contenant les champs autorisés
const ALLOWED_ARTICLE_FIELDS = ["title", "content", "published"];
const ALLOWED_USER_FIELDS = ["id", "name", "email"];

const articleController = {
  // http://localhost:3000/api/articles/?page=42&limit=20
  findAndCountAll: async (req, res) => {
    try {
      // Création d'un système de pagination
      const page = Math.max(1, parseInt(req.query.page) || 1); // Minimum page 1
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Entre 1 et 100

      // const queryLimit = parseInt(req.query.limit); // 20
      // const limitDefault = queryLimit || 10; // Si NaN ou undefined on prend 10
      // const minLimit = Math.max(1, limitDefault) // Pas en dessous de 1
      // const maxLimit = Math.min(100, minLimit) // Pas au dessous de 100

      const offset = (page - 1) * limit;

      // Récupération des articles dans la db et injection de la pagination
      const { count, rows } = await Article.findAndCountAll({
        include: [
          {
            model: User,
            as: "author",
            attributes: ALLOWED_USER_FIELDS, // Limite les champs de l'utilisateur récupérés
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]], // Du plus récent au plus vieux
      });

      // Restructuration de la réponse en json
      res.status(200).json({
        data: rows,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de l'éxécution de la requête : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  findByPk: async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Format d'id invalide" });
      }

      const article = await Article.findByPk(articleId);

      if (!article) {
        return res.status(404).json({ error: "Article introuvable ou inexistant" });
      }

      res.status(200).json(article);
    } catch (error) {
      console.error(`Erreur lors du traitement de la requête : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  create: async (req, res) => {
    try {
      // Vérification de l'existence de l'id de l'auteur
      if (!req.body.authorId) {
        return res.status(400).json({
          error: "L'id de l'auteur est obligatoire",
        });
      }

      const sanitizeData = {
        // Le spread operator a l'appel d'une fonction, spread directement
        // dans l'object retourné en résultat de la fonction
        ...sanitizeInput(req.body, ALLOWED_ARTICLE_FIELDS),
        authorId: req.body.authorId,
      };

      // Vérification de l'existence de l'utilisateur
      const userExists = await User.findByPk(sanitizeData.authorId);
      if (!userExists) {
        return res.status(404).json({
          error: "L'utilisateur n'existe pas",
        });
      }

      // Création de l'article et insertion dans la DB
      const article = await Article.create(sanitizeData);

      res.status(201).json(article);
    } catch (error) {
      // Gestion des erreurs de validation
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      console.error(`Erreur lors de la requête : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const { authorId } = req.query;

      if (!authorId) {
        return res.status(400).json({
          error: "L'id de l'auteur est obligatoire",
        });
      }

      // Suppression de l'article uniquement si authorId = propriétaire de l'article
      const deleted = await Article.destroy({
        where: {
          id,
          authorId,
        },
      });

      if (!deleted) {
        return res.status(404).json({
          error: "Article inexistant ou l'authorId n'est pas le propriétaire de l'article",
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error(`Erreur lors de la requête : ${error}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};

module.exports = articleController;
