const router = require('express').Router();
const authorRouter = require('./author.router');
const bookRouter = require('./book.router');
const authRouter = require('./auth.router');

router.use('/authors', authorRouter);
router.use('/books', bookRouter);
router.use('/auth', authRouter);

module.exports = router;
