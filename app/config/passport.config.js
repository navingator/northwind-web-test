'use strict';

let passport = require('passport');
let path = require('path');
let User = require(path.resolve('./app/models/user.model.js'));

module.exports = function() {

  // Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

  // Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.getById(id)
      .then(function(user) {
        delete user.password;
        return done(null, user);
      })
      .catch(function(err) {
        return done(err, null);
      });
	});

  // Initialize strategies
  require('./strategies/local.js')(); //local strategy
};
