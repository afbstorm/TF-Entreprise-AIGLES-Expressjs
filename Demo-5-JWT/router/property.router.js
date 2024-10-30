const router = require("express").Router();
const propertyController = require("../controllers/property.controller");
const { authenticateJWT, isOwner } = require("../middlewares/auth");

router.get("/", propertyController.findAll);
// Itinéraire :
// 1 - Vérification de la validité du token
// 2 - Vérification du rôle
// 3 - Envoi vers la méthode de création
router.post("/", authenticateJWT, isOwner, propertyController.create);

module.exports = router;
