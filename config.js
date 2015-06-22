'use strict';

var keys = require('lanetix-microservice').keys;

module.exports = function () {

  return {
    apiUri: process.env.API_URI || 'http://localhost:5002',
    authUri: process.env.AUTH_URI || 'http://localhost:5000',
    privateKey: process.env.PRIVATE_KEY || keys[process.env.NODE_ENV || 'test'].privateKey,
    postgres: process.env.DATABASE_URL || 'postgres://postgres@localhost/test_user_listener',
    amqp: {
      url: process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672'
    }
  };
};
