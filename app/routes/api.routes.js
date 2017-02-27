'use strict';

var express = require('express');
var router = express.Router();

module.exports = router;

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// sub-routes
require('./api/users.routes.js')(router);
