'use strict';

var express = require('express');
var router = express.Router();

// sub-routes
require('./api/users.routes.js')(router);

module.exports = router;
