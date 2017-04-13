'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

/**
 * Object that maps files from a source to a destination location
 * that is relative to /public/lib.
 * For example, 'scripts/foo.js':'bar' would copy foo.js from /scripts/foo.js to
 * /public/lib/bar/foo.js
 */
const fileMap = {
  // Bootstrap
  'node_modules/bootstrap/dist/css/bootstrap.min.css': 'bootstrap/',
  'node_modules/bootstrap/dist/css/bootstrap.min.css.map': 'bootstrap/',
  'node_modules/bootstrap/dist/js/bootstrap.min.js': 'bootstrap/',
  'node_modules/jquery/dist/jquery.min.js': 'jquery/',
  'node_modules/tether/dist/js/tether.min.js': 'tether/',

  // Angular Dependencies
  'node_modules/core-js/client/shim.min.js': 'core-js/',
  'node_modules/core-js/client/shim.min.js.map': 'core-js/',
  'node_modules/zone.js/dist/zone.min.js': 'zone.js/'
};
const libDir = 'public/lib';

function copyFiles() {

  fs.mkdirSync(libDir); // make the base directory

  for (const source in fileMap) {
    if (fileMap.hasOwnProperty(source)) {
      // make the target directory
      const targetDir = path.join(libDir, fileMap[source]);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }

      // copy the file
      const sourcePath = source.split('/');
      const target = path.join(targetDir, sourcePath[sourcePath.length-1]);
      fs.createReadStream(source).pipe(fs.createWriteStream(target));
      console.log('Copied ' + source + ' to ' + targetDir);
    }
  }
}

// Cleanup directory asynchronously
rimraf(libDir, {}, () => {
  console.log('Deleted ' + libDir);
  copyFiles();
});
