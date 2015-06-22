/* istanbul ignore next */
'use strict';

var path = require('path');

module.exports = {

  up: function (knex, Bromise) {
    var loadFile = new Bromise(function (resolve, reject) {
      var fs = require('fs');
      fs.readFile(path.join(__dirname, '/FOR_TEST_PURPOSES_ONLY.sql'), function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data.toString());
      });
    }), all = loadFile.then(knex.raw);
    return knex.schema.hasTable('knex_migrations').then(function (exists) {
      if (!exists) {
        return all;
      }
      return knex.raw('SELECT count(*) FROM knex_migrations').then(function (data) {
        if (data.rows[0].count === '0') {
          return all;
        }
      });
    });
  },

  down: function () {
    // I don't want to implement dropping all tables. Too risky.  You can do it manually if you need.
  }
};
