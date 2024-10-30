const {Author} = require("../models");
const authorController = {
    findAll: async (req, res) => {
        try {
            const authors = await Author.findAll();
            res.json(authors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    findByPk: async (req, res) => {
        try {
            const author = await Author.findByPk(req.params.id);
            if (!author) {
                return res.status(404).json({ error: 'Auteur non trouvé' });
            }
            res.json(author);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const author = await Author.create(req.body);
            res.status(201).json(author);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const author = await Author.findByPk(req.params.id);
            if (!author) {
                return res.status(404).json({ error: 'Auteur non trouvé' });
            }
            await author.update(req.body);
            res.json(author);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    destroy: async (req, res) => {
        try {
            const deleted = await Author.destroy({
                where: { id: req.params.id }
            });
            if (!deleted) {
                return res.status(404).json({ error: 'Auteur non trouvé' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    findAllByAuthor: async (req, res) => {
        try {
            const author = await Author.findByPk(req.params.id, {
                include: ['books']
            });
            if (!author) {
                return res.status(404).json({ error: 'Auteur non trouvé' });
            }
            res.json(author.books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = authorController;
