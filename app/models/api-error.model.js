'use strict';

exports.getAPIError = function(dbError) {
  return dbError; // If lookup didn't find anything, send back the default error
};
