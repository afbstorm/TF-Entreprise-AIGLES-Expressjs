const { Booking, Property } = require("../models");
const { Op } = require("sequelize");

const bookingController = {
  create: async (req, res) => {
    try {
      const { propertyId, checkIn, checkOut } = req.body;

      // Vérification de disponibilité
      // On vérifie que le statut du bien ne soit pas "confirmed"
      // On vérifie également les dates checkIn et checkOut
      const existingBooking = await Booking.findOne({
        where: {
          propertyId,
          status: "confirmed",
          [Op.or]: [
            {
              checkIn: {
                [Op.between]: [checkIn, checkOut],
              },
            },
            {
              checkOut: {
                [Op.between]: [checkIn, checkOut],
              },
            },
          ],
        },
      });

      if (existingBooking) {
        return res.status(400).json({ error: "Propriété non disponible pour les dates demandées" });
      }

      // Calcul le prix total du séjour
      const property = await Property.findByPk(propertyId);

      // (new Date(checkOut) - new Date(checkIn) - Va return une durée en millisecondes
      // (1000*60*60*24) - va return la durée en jours
      const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      const totalPrice = days * property.pricePerNight;

      const booking = await Booking.create({
        ...req.body,
        tenantId: req.user.id,
        totalPrice,
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = bookingController;
