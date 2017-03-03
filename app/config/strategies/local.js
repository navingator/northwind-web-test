'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var User = require(path.resolve('./app/models/user.model.js'));

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy(function(username, password, done) {
		var authUser; // to be used within promises
		User.getUserByUsername(username)
			.then(function(user) {
				authUser=user;
				return user.authenticate(password);
			})
			.then(function(res) {
				if(res) {
					return done(null, authUser);
				} else {
					return done(null, false, {
						message: 'Password invalid'
					});
				}
			})
			.catch(function(err) {
				console.log(err);
				//TODO separate errors
				if (err) {
					return done(null, false, {
						message: 'Username not found'
					});
				}
				return done(err);
			});
	}
	));
};
