const validateArticles = (req, res, next) => {
  const { title, content, authorId } = req.body;

  if (!title || title.length < 10) {
    return res
      .status(400)
      .json({ error: "Le titre doit faire au moins 10 caractères" });
  }

  if (!content || content.length < 50) {
    return res
      .status(400)
      .json({ error: "Le contenu doit faire au moins 50 caractères" });
  }

  if (!authorId || typeof authorId !== "number") {
    return res.status(400).json({ error: "AuthorId invalide" });
  }

  next();
};

module.exports = validateArticles;
