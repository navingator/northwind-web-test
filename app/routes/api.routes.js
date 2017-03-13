'use strict';

var express = require('express');
var router = express.Router();

// sub-routes
require('./api/users.routes.js')(router);
require('./api/product-category.routes.js')(router);
require('./api/products.routes.js')(router);

module.exports = router;
