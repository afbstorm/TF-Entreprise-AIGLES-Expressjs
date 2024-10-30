const { Property, User } = require("../models");

const propertyController = {
  create: async (req, res) => {
    try {
      const property = await Property.create({
        ...req.body,
        ownerId: req.user.id,
      });
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  findAll: async (req, res) => {
    try {
      const properties = await Property.findAll({
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "firstname", "lastname", "email"],
          },
        ],
      });

      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = propertyController;
