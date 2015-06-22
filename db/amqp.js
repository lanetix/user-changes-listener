'use strict';

var _ = require('underscore'),
  config = require('../config')(),
  amqpEasy = require('amqplib-easy')(config.amqp.url);

module.exports = _.reduce(
  amqpEasy,
  function (acc, method, methodName) {
    acc[methodName] = function () {
      return method.apply(amqpEasy, arguments)
        .catch(function (err) {
          console.error('Error: ', err);
        });
    };
    return acc;
  },
  {}
);
