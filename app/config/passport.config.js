'use strict';

var passport = require('passport');
var path = require('path');
var User = require(path.resolve('./app/models/user.model.js'));

module.exports = function() {

  // Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

  // Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.getUserById(id)
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
