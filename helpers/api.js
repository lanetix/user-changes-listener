'use strict';

var Bromise = require('bluebird'),
  jwt = require('jsonwebtoken'),
  request = require('request-promise'),
  config = require('../config')({ queueName: 'api_worker_users', schemaName: 'stagegate' }),
  url = require('url'),
  makeToken = require('@lanetix/make-token')(
    config.authUri,
    config.privateKey,
    'urn:lanetix/auth'
  );

module.exports = {
  getUserDetails: function (options) {
    if (!config.apiUri) {
      throw new Error('apiUri is missing.');
    }

    return Bromise.resolve()
      .then(function () {
        if (!options.authorization) {

          if (!options.by || !options.by.id) {
            throw new Error('User ID id is required to generate LX token');
          }

          return makeToken.forUser(options.by.id);
        }
      })
      .then(function (token) {
        var uri = url.resolve(config.apiUri, '/users/' + options.by.id);

        return request({
          url: uri,
          headers: {
            authorization: 'Bearer ' + token
          },
          method: 'GET',
          json: true
        });
      });
  }
};
