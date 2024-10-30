const jwt = require('jsonwebtoken');
const {Book, Author} = require("../models");
const {Op} = require("sequelize");

const SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token invalide ou expiré.' });
    }
};

const isAuthor = (req, res, next) => {
    if (req.user.role !== 'author') {
        return res.status(403).json({ error: 'Accès refusé. Vous devez être auteur pour accèder à cette ressource.' });
    }
    next();
};

const isBookAuthor = async (req, res, next) => {
    try {
        const isAuthor = await Book.findOne({
            where: {
                [Op.and]: {
                    id: parseInt(req.params.id),
                    authorId: req.user.id
                }
            }
        })

        if (!isAuthor) {
            return res.status(403).json({error: "Accès refusé. Vous devez être l'auteur du livre pour intéragir avec."})
        }

        next();
    } catch (error) {
        res.status(403).json({error: "Accès refusé. Vous devez être l'auteur du livre pour intéragir avec."})
    }
}

const isAccountOwner = async (req, res, next) => {
    try {
        const owner = await Author.findByPk(req.user.id);

        console.log(owner.id, req.params.id)

        if (owner.id !== parseInt(req.params.id)) {
            res.status(403).json({error: "Accès refusé. Ce n'est pas votre compte."})
        }

        next();

    } catch (error) {
        res.status(403).json({error: "Accès refusé."})
    }
}

module.exports = { authenticateJWT, isAuthor, isBookAuthor, isAccountOwner };
