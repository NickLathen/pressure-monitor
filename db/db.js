var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/underpressure');

module.exports = db;