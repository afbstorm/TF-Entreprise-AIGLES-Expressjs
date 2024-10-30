# Formation Express.js avec SQL Server - Synthèse
### 1. Introduction à Node.js et Express.js

#### 1.1 Installation et Configuration

```bash
# Initialisation du projet
mkdir mon-api
cd mon-api
npm init -y

# Installation des dépendances de base
npm install express
npm install nodemon --save-dev
```

Configuration package.json :
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

#### 1.2 Premier serveur Express

```javascript
// index.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API!' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
```

#### Exemple plus poussé

```javascript
// routes/tasks.js
const express = require('express');
const index = express.Router();

let tasks = [];

index.get('/', (req, res) => {
  res.json(tasks);
});

index.post('/', (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false
  };
  tasks.push(task);
  res.status(201).json(task);
});

index.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  
  task.completed = req.body.completed;
  res.json(task);
});

module.exports = index;
```

```javascript
// index.js
const express = require('express');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);

app.listen(3000);
```
### 1. Concepts REST

#### Principes de base
- Ressources identifiées par URLs
- Méthodes HTTP standards
- Stateless
- Réponses cohérentes

#### Structure des URLs
```
GET /api/users            # Liste des utilisateurs
GET /api/users/1          # Un utilisateur spécifique
POST /api/users           # Création
PUT /api/users/1          # Modification complète
PATCH /api/users/1        # Modification partielle
DELETE /api/users/1       # Suppression
```

### 2. Middleware et Validation

```javascript
// middleware/validate.js
const validateUserMiddleware = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.length < 3) {
    return res.status(400).json({ 
      error: 'Le nom doit faire au moins 3 caractères' 
    });
  }
  
  next();
};

module.exports = { validateUserMiddleware };
```

#### Exemple plus poussé

```javascript
// middleware/validate.js
const validateArticle = (req, res, next) => {
  const { title, content, authorId } = req.body;
  
  if (!title || title.length < 5) {
    return res.status(400).json({
      error: 'Le titre doit faire au moins 5 caractères'
    });
  }
  
  if (!content || content.length < 50) {
    return res.status(400).json({
      error: 'Le contenu doit faire au moins 50 caractères'
    });
  }
  
  if (!authorId || typeof authorId !== 'number') {
    return res.status(400).json({
      error: 'AuthorId invalide'
    });
  }
  
  next();
};

module.exports = { validateArticle };
```

```javascript
// routes/articles.js
const express = require('express');
const router = express.Router();
const { validateArticle } = require('../middleware/validate');

let articles = [];

router.get('/', (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    data: articles.slice(startIndex, endIndex),
    pagination: {
      total: articles.length,
      page,
      pages: Math.ceil(articles.length / limit)
    }
  };
  
  res.json(results);
});

router.get('/:id', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).json({ error: 'Article non trouvé' });
  res.json(article);
});

router.post('/', validateArticle, (req, res) => {
  const article = {
    id: articles.length + 1,
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId,
    createdAt: new Date()
  };
  
  articles.push(article);
  res.status(201).json(article);
});

router.put('/:id', validateArticle, (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).json({ error: 'Article non trouvé' });
  
  article.title = req.body.title;
  article.content = req.body.content;
  article.authorId = req.body.authorId;
  article.updatedAt = new Date();
  
  res.json(article);
});

router.delete('/:id', (req, res) => {
  const index = articles.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Article non trouvé' });
  
  articles.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
```

## SQL Server et Sequelize

### 1. Configuration initiale

```bash
npm install sequelize tedious
npm install sequelize-cli --save-dev
```

Configuration Sequelize :
```javascript
// config/database.js
module.exports = {
  development: {
    dialect: 'mssql',
    host: 'localhost',
    username: 'sa',
    password: 'VotreMotDePasse',
    database: 'formation_express',
    options: {
      trustServerCertificate: true
    }
  }
};
```

### 2. Modèles Sequelize

```javascript
// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'authorId',
      as: 'articles'
    });
  };

  return User;
};
```

```javascript
// models/Article.js
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });
  };

  return Article;
};
```
#### Exemple plus poussé

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { User, Article } = require('../models');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Article,
        as: 'articles',
        where: { published: true },
        required: false
      }]
    });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

## Authentification

### 1. Configuration JWT

```bash
npm install jsonwebtoken bcryptjs
```

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // Au lieu d'utiliser split() on peut simplement venir remplacer les strings autre que le token
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;
```

#### Exemple plus poussé

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET = process.env.JWT_SECRET;

const authController = {
    create: async (req, res) => {
        try {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const author = await Author.create({
                ...req.body,
                password: hashedPassword
            });

            const token = jwt.sign(
                {
                    id: author.id,
                    email: author.email,
                    role: author.role
                },
                SECRET,
                { expiresIn: '24h' }
            );

            const { password, ...authorWithoutPassword } = author.toJSON();
            res.status(201).json({ author: authorWithoutPassword, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const author = await Author.findOne({ where: { email } });
            if (!author) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const validPassword = await bcrypt.compare(password, author.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign(
                {
                    id: author.id,
                    email: author.email,
                    role: author.role
                },
                SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...authorWithoutPassword } = author.toJSON();
            res.json({ user: authorWithoutPassword, token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = authController;;
```

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.create);

router.post('/login', authController.login);

module.exports = router;
```

## Intégration React

### 1. Configuration CORS

```javascript
// middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  credentials: true,
  maxAge: 86400
};

module.exports = cors(corsOptions);
```

### 2. Service d'API React

```javascript
// Frontend: services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const ArticleService = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/articles?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`)
};
```

#### Exemple front en React

```javascript
// hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await AuthService.getCurrentUser();
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await AuthService.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

```javascript
// pages/ArticleList.js
import { useState, useEffect } from 'react';
import { ArticleService } from '../services/api';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data } = await ArticleService.getAll(page);
        setArticles(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Articles</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <div key={article.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600 mt-2">
              {article.content.substring(0, 150)}...
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Par {article.author.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```
