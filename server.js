// modules =================================================
var express = require('express');
var browserSync = require('browser-sync')
var path = require('path');
var pg = require('pg');

var app = express();

// configuration ===========================================
require('dotenv').config()
var port = process.env.PORT || 3002; // set our port

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
    port: process.env.BROWSER_SYNC_PORT || 3000,
    files: ['public/**/*.{js,css,html}'],
    ui: {
      port: parseInt(process.env.BROWSER_SYNC_UI_PORT || 3001)
    },
    open: false
  });
}

exports = module.exports = app; 						// expose app
