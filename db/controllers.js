const userController = require('./controllers/userController');
const models = require('./models.js');

module.exports = {
  userController,
  sync: models.sync
};