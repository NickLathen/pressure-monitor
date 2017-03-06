const models = require('../models.js');
const userModel = models.userModel;
const pressureModel = models.pressureModel;


const getUser = function getUser(username) {
  return userModel.findOne({where: {username}});
};
const createUser = function createUser(username) {
  return userModel.create({username});
};
const getPressures = function createUser(username) {
  debugger;
};
const addPressure = function addPressure(username) {
};


module.exports = {
  getUser,
  createUser,
  getPressures,
  addPressure
};