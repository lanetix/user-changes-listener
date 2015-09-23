'use strict';

var keys = require('@lanetix/microservice').keys;

module.exports = {
  apiUri: process.env.API_URL || 'http://localhost:5002',
  authUri: process.env.AUTH_URL || 'http://localhost:5000',
  privateKey: process.env.PRIVATE_KEY || keys[process.env.NODE_ENV || 'test'].privateKey,
  postgres: process.env.DATABASE_URL || 'postgres://postgres@localhost/test_user_listener',
  issuer: 'urn:lanetix/stagegate',
  amqp: {
    url: process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672'
  }
};
