'use strict';
// configuration ===========================================
/* Setup app root directory for PM2  */
let appRoot = require('app-root-path');
process.chdir(appRoot.toString())// Required for PM2, as it launches in separate directory

global.Promise = require('bluebird'); // Set the global promise library
require('dotenv').config(); // Set environment variables
let config = require('./app/config/config'); // general configuration
let app = require('./app/config/express.config')(); // express configuration
require('./app/config/passport.config')(); // passport configuration

// start app ===============================================
let port = config.port; // set our port
app.listen(port, config.startBrowserSync);
console.log('Listening on port ' + port); // shoutout to the user

exports = module.exports = app; // expose app
