const controllers = require('../../db/controllers.js');
const models = require('../../db/models.js');
const userModel = models.userModel;
const userController = controllers.userController;

controllers.sync()
.then(() => {
  userController.getUser('Alice')
  .then(user => {
    userController.addPressure('Alice', {date: 1, systolic: 140, diastolic: 80});
  });
});