// modules =================================================
var express = require('express');
var browserSync = require('browser-sync')
var path = require('path');
var pg = require('pg');

var ports = require('./ports.json');

var app = express();

// configuration ===========================================
var port = process.env.PORT || ports.server; // set our port

app.use(express.static(path.join(__dirname, '/public'))); // set the static files location, example: /public/img will be /img for users
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));


// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port, browserSyncListen);
console.log('Listening on port ' + port); 			// shoutout to the user

function browserSyncListen() {
  browserSync({
    proxy: 'localhost:' + port,
    port: ports.browserSync,
    files: ['public/**/*.{js,css,html}'],
    ui: {
      port: ports.browserSyncUI
    },
    open: false
  });
}

exports = module.exports = app; 						// expose app
