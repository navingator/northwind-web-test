'use strict';

let path = require('path');
let ApiError = require(path.resolve('./app/models/api-error.model.js'));

exports.handleDbError = (err, res) => {
  ApiError.getApiError(err)
    .then(apiErr => res.status(400).send(apiErr))
    .catch(() => res.status(400).send(err)); // TODO add error logging here
};
