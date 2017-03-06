const controllers = require('../../db/controllers.js');
const userController = controllers.userController;
const bareRequest = require('request');
const config = require('../../config/config.js');
const AUTH0_DOMAIN = config.AUTH0_DOMAIN;

const request = function request(options) {
  return new Promise(function(resolve, reject) {
    bareRequest(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

const getUsername = function getUsername(token) {
  return request({
    url: `https://${AUTH0_DOMAIN}/tokeninfo?id_token=${token}`
  })
  .then((response) => {
    const username = JSON.parse(response.body).email;
    if (username) {
      return username;
    } else {
      throw Error('no user found with that token.');
    } 
  });
};

module.exports = {
  submitPressure(request, response) {
    const body = request.body;
    const token = body.token;
    const diastolic = body.diastolic;
    const systolic = body.systolic;
    const date = Date.now();
    getUsername(token)
    .then(username => {
      userController.addPressure(username, {date, systolic, diastolic})
      .then(pressure => {
        response.status(200);
        response.send('success');
      })
      .catch(error => {
        response.status(500);
        response.send('internal error');
      });
    });
  },
  getPressures(request, response) {
    const body = request.body;
    const token = body.token;
    getUsername(token)
    .then(username => {
      userController.getPressures(username)
      .then(pressures => {
        debugger;
      });
    });
  }
};