// configuration ===========================================
require('dotenv').config()
var app = require('./app/config/express.config')();
var config = require('./app/config/config');

// start app ===============================================
var port = config.port; // set our port
app.listen(port, config.startBrowserSync);
console.log('Listening on port ' + port); 			// shoutout to the user

exports = module.exports = app; 						// expose app
