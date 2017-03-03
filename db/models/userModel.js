const db = require('../db');
const Sequelize = require('sequelize');

const user = db.define('user', {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.TEXT,
    unique: true
  },
  password: {
    type: Sequelize.TEXT
  },
});

module.exports = user;