'use strict';
// configuration ===========================================
require('dotenv').config();
var config = require('./app/config/config'); // general configuration
var app = require('./app/config/express.config')(); // express configuration
require('./app/config/passport.config')(); // passport configuration

// start app ===============================================
var port = config.port; // set our port
app.listen(port, config.startBrowserSync);
console.log('Listening on port ' + port); // shoutout to the user

exports = module.exports = app; // expose app
