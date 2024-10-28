const router = require("express").Router();
const validateArticles = require("../middlewares/validateArticles");

let articlesList = [];

router.get("/articles", (req, res) => {
  const results = {
    data: articlesList,
  };

  res.status(200).json(results);
});

router.get("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const article = articlesList.find((a) => a.id === id);

  if (!article) {
    return res.status(404).json({ error: "Article introuvable ou inexistant" });
  }

  res.status(200).json(article);
});

router.post("/articles", validateArticles, (req, res) => {
  const { title, content, authorId } = req.body;
  const createdAt = new Date();

  const article = {
    id: articlesList.length + 1,
    title,
    content,
    authorId,
    createdAt,
  };

  articlesList.push(article);
  res.status(201).json(article);
});

router.put("/articles/:id", validateArticles, (req, res) => {
  const { title, content, authorId } = req.body;
  const id = parseInt(req.params.id);
  const article = articlesList.find((a) => a.id === id);

  if (!article) {
    return res.status(404).json({ error: "Article introuvable ou inexistant" });
  }

  article.title = title;
  article.content = content;
  article.authorId = authorId;
  article.updatedAt = new Date();

  res.status(200).json(article);
});

router.delete("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const article = articlesList.find((a) => a.id === id);

  if (!article) {
    return res
      .status(404)
      .json({ error: "Cet article est introuvable ou inexistant" });
  }

  const newArticles = articlesList.filter((a) => a.id !== id);

  articlesList = [...newArticles];
  res
    .status(200)
    .json({ message: "Article correctement supprimé", data: articlesList });
});

router.get("**", (req, res) => {
  res.status(404).send("Cette route n'existe pas");
});

module.exports = router;
