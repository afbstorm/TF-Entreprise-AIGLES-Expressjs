const router = require('express').Router();
const authorController = require('../controllers/author.controller');
const {authenticateJWT, isAuthor, isAccountOwner} = require("../middlewares/auth");

router.get('/', authorController.findAll);

router.get('/:id', authorController.findByPk);

router.post('/', authenticateJWT, isAuthor, authorController.create);

router.patch('/:id', authenticateJWT, isAccountOwner, authorController.update);

router.delete('/:id', authenticateJWT, isAccountOwner, authorController.destroy);

// Route pour obtenir tous les livres d'un auteur
router.get('/:id/books', authorController.findAllByAuthor);

module.exports = router;
