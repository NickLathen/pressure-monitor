const db = require('../db');
const Sequelize = require('sequelize');

const pressure = db.define('pressure', {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.BIGINT,
    unique: true
  },
  systolic: {
    type: Sequelize.INTEGER
  },
  diastolic: {
    type: Sequelize.INTEGER
  }
});

module.exports = pressure;