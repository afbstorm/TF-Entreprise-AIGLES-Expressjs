const router = require("express").Router();
// Destructuring de l'élement lors de l'import vu que exporter sous forme object : key/value
const { validateUser } = require("../middlewares/validateUser.middleware");

let usersList = [];

// http://localhost:3000/api/users
router.get("/users", (req, res) => {
  res.status(200).json({ users: usersList });
});

// http://localhost:3000/api/users/42
router.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersList.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "Cet utilisateur n'existe pas" });
  }

  res.status(200).json({ user });
});

// http://localhost:3000/api/users
router.post("/users", validateUser, (req, res) => {
  const { name, age, job } = req.body;
  const user = {
    id: Math.floor(Math.random() * 100),
    name,
    age,
    job,
  };

  usersList.push(user);
  res.status(201).json({ users: usersList });
});

// http://localhost:3000/api/users/42
router.put("/users/:id", validateUser, (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersList.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "L'utilisateur n'existe pas" });
  }

  // Créer un object qui va garder une trace des changements
  const updatedValues = {};

  // Parcourt de l'object pour vérifier les clés/valeurs et voir ce qui a été modifié
  Object.keys(req.body).forEach((key) => {
    // Si la value de la clé de user est différente de la value de la clé du body
    // on stocke la nouvelle valeur dans updatedValues et on modifie la valeur de user
    if (user[key] !== req.body[key]) {
      updatedValues[key] = {
        oldValue: user[key],
        newValue: req.body[key],
      };
      // On modifie les valeurs de la clé user par rapport aux valeurs des clés du body
      user[key] = req.body[key];
    }
    // Si pas, on ne fait pas de changement
  });

  // Si il n'y a pas de modifications, on renvoie OK (204 : no content)
  if (Object.keys(updatedValues).length === 0) {
    return res.status(204).json({ message: "Aucun changement effectué" });
  }

  res.status(200).json({ message: "Modifications effectuées", user });
});

module.exports = router;
