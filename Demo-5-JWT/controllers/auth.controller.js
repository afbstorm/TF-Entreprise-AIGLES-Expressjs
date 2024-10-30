const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

const authController = {
  create: async (req, res) => {
    try {
      // le 10 resprésente le saltRound, c'est le temps que prendra le hashing
      // plus ce sera long, plus la complexité du hash sera grande
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Création de l'utilisateur
      const user = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      // Génération du token (jwt)
      // la méthode sign prendra plusieurs paramètres
      // Le premier sera un object qui contiendra les informations utilisateur
      // que l'on veut faire suivre au client
      // Le deuxième sera le secret pour décoder et encoder les informations
      // Le troisième un object d'options
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        SECRET,
        {
          expiresIn: "24h",
        }
      );

      const { password, ...userWithoutPassword } = user.toJSON();
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérification de l'existence de l'utilisateur
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Mot de passe ou email incorrect" });
      }

      // Vérification du mot de passe en comparant le mot de passe entré par l'utilisateur
      // au mot de passe dans la DB (hash)
      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Mot de passe ou email incorrect" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        SECRET,
        {
          expiresIn: "24h",
        }
      );

      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
