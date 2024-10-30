const router = require('express').Router();
const bookController = require('../controllers/book.controller');
const {authenticateJWT, isAuthor, isBookAuthor} = require("../middlewares/auth");

router.get('/', bookController.findByFilters);

router.get('/:id', bookController.findByPk);

router.post('/', authenticateJWT, isAuthor, bookController.create);

// Mise à jour de plusieurs livres
router.patch('/bulk', authenticateJWT, isBookAuthor, bookController.multipleUpdate);

module.exports = router;
