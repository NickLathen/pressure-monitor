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
  return getUser(username)
  .then(user => {
    return pressureModel.findAll({where: {userId: user._id}});
  });
};
const addPressure = function addPressure(username, pressure) {
  return getUser(username)
  .then(user => {
    const date = pressure.date;
    const systolic = pressure.systolic;
    const diastolic = pressure.diastolic;
    const userId = user._id;
    return pressureModel.create({date, systolic, diastolic, userId});
  });
};


module.exports = {
  getUser,
  createUser,
  getPressures,
  addPressure
};