const router = require("express").Router();
const articleController = require("../controllers/article.controller");

router.get("/", articleController.findAndCountAll);
router.get("/:id", articleController.findByPk);
router.post("/", articleController.create);
router.delete("/:id", articleController.destroy);

module.exports = router;
