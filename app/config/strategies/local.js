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
	/**
	 * done function callback on LocalStrategy expects 3 inputs
	 * 	err - error ojbect
	 * 	user - user object (on sucess)
	 * 	info - info to attach with the object
	 */
	passport.use(new LocalStrategy(function(username, password, done) {
		var authUser; // to be used within promises
		User.getByUsername(username)
			.then(function(user) {
				authUser=user;
				return user.authenticate(password);
			})
			.then(function(res) {
				if(res) {
					return done(null, authUser);
				} else {
					return done(null, false, {
						message: 'Invalid password'
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
