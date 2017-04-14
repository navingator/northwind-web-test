'use strict';

let express = require('express');
let helmet = require('helmet');
let appRoot = require('app-root-path');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let morgan = require('morgan');
let passport = require('passport');
let session = require('express-session');
let pgStore = require('connect-pg-simple')(session);

let api = require(appRoot + '/app/routes/api.routes');
let coreRouter = require(appRoot + '/app/routes/core.routes');

module.exports = function () {
  // Initialize the express application
  let app = express();

  // Adding backend security package
  app.use(helmet()); // https://www.npmjs.com/package/helmet

  // Logging and Parsing ===================================
  app.use(morgan('dev'));
  // Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
  app.use(methodOverride());

  // Authentication ========================================
  let pg = require('./db.config').pgp.pg; // get postgres from postgres-promise
  let sess = {
    name: 'northwind.connect.sid',
    secret: process.env.SESSION_SECRET,
    resave: false, //https://github.com/expressjs/session#resave typically false, unless we implement touch method
    saveUninitialized: false, // https://github.com/expressjs/session#saveuninitialized
    store: new pgStore({ pg: pg }), // connect-pg-simple store
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  };

  app.use(session(sess)); // Run the session

  app.use(passport.initialize());
  app.use(passport.session());

  // Static Files ==========================================
  app.use(express.static(appRoot + '/public')); // set the static files location, example: /public/img will be /img for client
  if(process.env.NODE_ENV === 'development') {
    app.use('/node_modules', express.static(appRoot + '/node_modules')); // exposes node_modules
    app.use(express.static(appRoot + '/mochawesome-reports')); // exposes mochawesome.html
  }

  // Routes ================================================
  app.use('/api', api);
  coreRouter(app); // frontend routes - must be last, as it is a wildcard route

  return app;
};
