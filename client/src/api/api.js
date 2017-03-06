const browserRequest = require('browser-request');

const request = function request(options) {
  return new Promise(function(resolve, reject) {
    browserRequest(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export default {
  submitPressure(token, systolic, diastolic) {
    return request({
      url: '/api/submitPressure',
      method: 'POST',
      body: {token, systolic, diastolic},
      json: true
    });
  },
  getPressures(token) {
    return request({
      url: `/api/getPressures?token=${token}`,
      method: 'GET',
      json: true
    })
    .then(response => {
      return response.body;
    });
  }
};