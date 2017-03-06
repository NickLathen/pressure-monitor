const db = require('./db.js');
const userModel = require('./models/userModel.js');
const pressureModel = require('./models/pressureModel.js');

userModel.hasMany(pressureModel, {as: 'pressures', foreignKey: 'userId'});

const loadOrder = [
  userModel,
  pressureModel
];

const sync = function sync(args) {
  
  const syncAll = function(modelArray, index) {
    const currModel = modelArray[index];
    return currModel.sync(args)
    .then(() => {
      const nextIndex = index + 1;
      if (nextIndex === modelArray.length) {
        return null;
      } else {
        return syncAll(modelArray, nextIndex);
      }
    });
  };
  
  return syncAll(loadOrder, 0)
  .then(() => {
    return db.sync();
  });
};


module.exports = {
  userModel,
  pressureModel,
  sync
};