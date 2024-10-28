const router = require("express").Router();

let usersList = [
  {
    id: 1,
    name: "Eddy",
    email: "e-d-d-y@email.rdc",
  },
  {
    id: 2,
    name: "Sébastien",
    email: "bya@email.be",
  },
];

// 'api', router
// 'api/users'
// GET 'api/users'
// GET 'api/users/:id'
// POST 'api/users'
// PUT / PATCH 'api/users/:id'
// DELETE 'api/users/:id'
// 'api/products'
// 'api/bookings'

// Status code
// 200 : OK
// 201 : Created
// 204 : No-Content
// 404 : Not found
// 403 : Unauthorized
// 401 : Forbidden
// 301 : Redirect (de manière temporaire)
// 302 : Redirect (de manière permanente)
// 500 : Server error

router.get("/utilisateurs", (req, res) => {
  res.send(usersList);
});

router.get("/utilisateurs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersList.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur inexistant" });
  }

  res.send(user);
});

router.post("/ajouter-utilisateur", (req, res) => {
  // Récupération par destructuring des éléments qui constituent le body de notre request
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(403).send("Nom et email requis");
  }

  const newUser = {
    id: usersList.length + 1,
    // vu que la clé et la variable contenant la valeur portent le même nom
    // on peut simplement indiquer une fois le nom plutôt que name: name
    name,
    email,
  };

  usersList.push(newUser);
  res.status(201).send("Utilisateur créé avec succès");
});

router.put("/modifier-utilisateur/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const userIndex = usersList.findIndex((user) => user.id === id);

  // Si findIndex return -1 cela veut dire qu'il n'y a pas de correspondance
  if (userIndex === -1) {
    return res.status(404).send("Utilisateur inexistant");
  }

  // On récupère le user sur cet index
  usersList[userIndex] = {
    // On spread le contenu du user dans l'object sauf pour le name et l'email
    ...usersList[userIndex],
    // On récupère le name du body et si pas présent le name de l'object
    name: name || usersList[userIndex].name,
    email: email || usersList[userIndex].email,
  };

  res.send("Modifications effectuées avec succès");
});

router.delete("/supprimer-utilisateur/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = usersList.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send("Utilisateur inexistant");
  }

  usersList = usersList.filter((user) => user.id !== id);

  res.send("Utilisateur supprimé avec succès");
});

module.exports = router;
