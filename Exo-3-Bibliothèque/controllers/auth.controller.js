const bcrypt = require("bcryptjs");
const {Author} = require("../models");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

const authController = {
    create: async (req, res) => {
        try {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const author = await Author.create({
                ...req.body,
                password: hashedPassword
            });

            const token = jwt.sign(
                {
                    id: author.id,
                    email: author.email,
                    role: author.role
                },
                SECRET,
                { expiresIn: '24h' }
            );

            const { password, ...authorWithoutPassword } = author.toJSON();
            res.status(201).json({ author: authorWithoutPassword, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const author = await Author.findOne({ where: { email } });
            if (!author) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const validPassword = await bcrypt.compare(password, author.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign(
                {
                    id: author.id,
                    email: author.email,
                    role: author.role
                },
                SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...authorWithoutPassword } = author.toJSON();
            res.json({ user: authorWithoutPassword, token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = authController;
