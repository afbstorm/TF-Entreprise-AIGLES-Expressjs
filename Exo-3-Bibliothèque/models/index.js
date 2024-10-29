const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
