// Initialisation du routeur d'express
const router = require("express").Router();

let tasksList = [];

// Création de la route index qui sera un GET
router.get("/", (req, res) => {
  res.json(tasksList);
});

router.post("/", (req, res) => {
  const task = {
    id: tasksList.length + 1,
    title: req.body.title,
    completed: false,
  };

  tasksList.push(task);
  res.status(201).json(task);
});

// Création d'une route qui va récupérer les params (par exemple : id ==> :param / :id)
router.put("/:id", (req, res) => {
  // Récupération de la tâche ayant un id égal à l'id passé en paramètre
  const task = tasksList.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    // Si pas de tâche correspondante, on renvoi un 404 avec un message d'erreur personnalisé
    return res.status(404).json({ error: "Tâche non trouvée" });
  }

  task.completed = req.body.completed;
  res.json(task);
});

module.exports = router;
