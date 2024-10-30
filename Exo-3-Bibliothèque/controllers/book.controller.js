const {Op} = require("sequelize");
const {Book, Author} = require("../models");
const bookController = {
    findByFilters: async (req, res) => {
        try {

            const {title, year} = req.query;

            // Gestion de la recherche et des filtres
            // Possibilité de rechercher par titre ou par année
            const where = {};
            if (title) {
                where.title = { [Op.like]: `%${title}%` };
            }
            if (year) {
                where.year = year;
            }

            const books = await Book.findAll({
                where,
                include: [{
                    model: Author,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }]
            });
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    findByPk: async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id, {
                include: [{
                    model: Author,
                    as: 'author'
                }]
            });
            if (!book) {
                return res.status(404).json({error: 'Livre non trouvé'});
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    create: async (req, res) => {
        try {
            const book = await Book.create(req.body);
            res.status(201).json(book);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    multipleUpdate: async (req, res) => {
        try {
            const { bookIds, updates } = req.body;
            await Book.update(updates, {
                where: {
                    id: {
                        [Op.in]: bookIds
                    }
                }
            });
            const updatedBooks = await Book.findAll({
                where: {
                    id: {
                        [Op.in]: bookIds
                    }
                },
                include: ['author']
            });
            res.json(updatedBooks);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = bookController;
