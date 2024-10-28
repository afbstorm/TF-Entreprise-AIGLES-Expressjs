# REST

### Énoncé

Création d'un CRUD respectant les principes de base REST.
Créez une liste d'articles (de journaux), chaque article sera représenté par un id, un titre, du contenu, un auteur(id d'un user), une date de création.

Consignes :

- Une route GET
- Une route GET/ID
- Une route POST
- Une route PUT/ID
- Une route DELETE/ID
- Un middleware de vérification
  - Le titre > 10
  - Le contenu > 50
  - Le type de l'id de l'auteur === number

## Contraintes :

- Respect des statut codes
- Respect de l'url
- Ajout d'une key de mise à jour pour le PUT
