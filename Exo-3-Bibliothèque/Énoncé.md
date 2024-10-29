# Exercice Gestion de Bibliothèque

## Étape 1 : Modèle Author

Créez un modèle Author avec :

- id (auto-incrémenté)
- name (string, obligatoire)
- email (string, unique, obligatoire)

Implémentez les routes CRUD :

- GET /authors
- GET /authors/:id
- POST /authors
- PUT /authors/:id
- DELETE /authors/:id

## Étape 2 : Modèle Book + Relations

Créez un modèle Book avec :

- id (auto-incrémenté)
- title (string, obligatoire)
- year (integer)
- authorId (clé étrangère)

Implémentez les routes :

- GET /books (avec les infos de l'auteur)
- POST /books
- GET /books/:id
- GET /authors/:id/books (tous les livres d'un auteur)
