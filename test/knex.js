'use strict';

var knexPgCustomSchema = require('knex-pg-customschema'),
  path = require('path'),
  config = require('../config')({ queueName: 'api_worker_users' });

module.exports = {
  //debug: true,

  client: 'pg',
  connection: config.postgres,

  // ensure that all queries in this application are bound to the "stagegate" schema in Postgres
  pool: {
    afterCreate: knexPgCustomSchema('public')
  },

  migrations: {
    directory: path.join(__dirname, '/migrations')
  }
};
