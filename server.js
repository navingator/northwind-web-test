// modules =================================================
var express = require('express');
var path = require('path');
var pg = require('pg');

var app = express();

// configuration ===========================================

var port = process.env.PORT || 4000; // set our port

app.use(express.static(path.join(__dirname, '/public'))); // set the static files location, example: /public/img will be /img for users
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));


// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);
console.log('Listening on port ' + port); 			// shoutout to the user
console.log('104.236.248.77:' + port);
exports = module.exports = app; 						// expose app
