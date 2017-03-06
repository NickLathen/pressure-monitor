const expect = require('chai').expect;
const controllers = require('../../db/controllers.js');
const models = require('../../db/models.js');
const userModel = models.userModel;
const userController = controllers.userController;

const user1 = 'Alice';
const user2 = 'Bob';

describe('Database', () => {
  it('should sync the models without error', done => {
    controllers.sync({force: true})
    .then(() => done());
  });
  describe('userController', () => {
    it('should add users', done => {
      Promise.all([
        userController.createUser(user1),
        userController.createUser(user2),
      ])
      .then((users) => {
        expect(users[0].username).to.equal(user1);
        expect(users[1].username).to.equal(user2);
        done();
      });
    });
    it('should get users', done => {
      Promise.all([
        userController.getUser('Alice'),
        userController.getUser('Bob'),
      ])
      .then( users => {
        expect(users[0].username).to.equal(user1);
        expect(users[1].username).to.equal(user2);
        done();
      });
    });
  });
});