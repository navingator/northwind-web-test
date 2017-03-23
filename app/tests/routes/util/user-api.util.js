'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = function(app) {

  /**
   * Creates a User using the API
   * @param  {User}    user User to create
   * @return {Promise}      Promise that resolves to an express response
   * SIDE EFFECTS: Sets the user's ID
   */
  let create = function(user) {
    return chai.request(app)
      .post('/api/users')
      .send(user)
      .then(res => {
        user.id = res.body.id; // set user ID for easy use later
        return res;
      });
  };

  /**
   * Signs in a User using the API
   * @param  {string}  user User object to authenticate with
   *                        (must have username and password)
   * @return {Promise}      Promise that resolves to an express response
   */
  let signin = function(user) {
    return chai.request(app)
      .post('/api/users/signin')
      .send(user);
  };

  return {
    create: create,
    signin: signin
  };

};
