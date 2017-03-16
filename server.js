'use strict';
// configuration ===========================================
global.Promise = require('bluebird'); // Set the global promise library
require('dotenv').config();
let config = require('./app/config/config'); // general configuration
let app = require('./app/config/express.config')(); // express configuration
require('./app/config/passport.config')(); // passport configuration

// start app ===============================================
let port = config.port; // set our port
app.listen(port, config.startBrowserSync);
console.log('Listening on port ' + port); // shoutout to the user

exports = module.exports = app; // expose app
