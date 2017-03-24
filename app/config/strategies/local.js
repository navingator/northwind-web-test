'use strict';

/**
 * Module dependencies.
 */
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let path = require('path');
let User = require(path.resolve('./app/models/user.model'));
let ApiError = require(path.resolve('./app/models/api-error.model'));

module.exports = function() {
	// Use local strategy
	/**
	 * done function callback on LocalStrategy expects 3 inputs
	 * 	err - error ojbect
	 * 	user - user object (on sucess)
	 * 	info - info to attach with the object
	 */
	passport.use(new LocalStrategy(function(username, password, done) {
		let authUser; // to be used within promises
		User.getByUsername(username)
			.then(user => {
				authUser=user;
				return user.authenticate(password);
			})
			.then(res => {
				if(res) {
					return done(null, authUser);
				} else {
					return ApiError.getApiError(1101)
						.then(apiErr => Promise.reject(apiErr));
				}
			})
			.catch(apiErr => {
				// 1100 - username not found, 1101 - password invalid
				if (apiErr.code === 1100 || apiErr.code === 1101) {
					return done(null, false, apiErr);
				}
				return done(apiErr);
			});
	}
	));
};
