'use strict';

var config = require('../config'),
  path = require('path'),
  configuration = {
    client: 'postgresql',
    connection: config.postgres,
    pool: {
      max: 1
    },
    migrations: {
      directory: path.join(__dirname, '/migrations')
    }
  };

module.exports = {
  development: configuration,
  test: configuration,
  production: configuration
};
