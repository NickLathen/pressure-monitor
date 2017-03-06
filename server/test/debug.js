const controllers = require('../../db/controllers.js');
const models = require('../../db/models.js');
const api = require('../middlewares/api.js');
const mock = require('./mock.js');
const config = require('../../config/config.js');
const token = config.token;
const userModel = models.userModel;
const userController = controllers.userController;

const requestMock = {
  body: {
    token: token,
  }
};
const responseMock = {
  status() {
  },
  send(pressures) {
    console.log(pressures);
  }
};
api.getPressures(requestMock, responseMock);