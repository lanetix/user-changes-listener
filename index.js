'use strict';

var _ = require('underscore'),
  amqp = require('./db/amqp'),
  Bromise = require('bluebird'),
  api = require('./helpers/api');

module.exports = {
  start: function (options) {
    var config = require('./config'),
      User = options.User;

    if (!options.queue) {
      throw new Error('options.queueName could not be found. Expected target queue name');
    }

    if (!User) {
      throw new Error('options.User is required.  Please provide user\'s model.  You can use the default implementation in /db/user');
    }

    return amqp.consume(_.defaults({ queue: options.queue, queueOptions: { durable: (options.durable === false) ? false : true } }, config.amqp), function (msg) {
      var userId = msg.json.item_id,
        organizationId = msg.json.organization_id,
        byId = msg.json.user_id,
        user = new User();

      return Bromise.resolve()
        .then(function () {
          return user.query({ where: { id: userId, organization_id: organizationId } }).fetch({by: {id: byId}});
        })
        .then(function (model) {
          if (!model) {
            // don't care about this user.
            return;
          }
          return api.getUserDetails(
            _.defaults({
              by: {
                id: byId
              }
            })
          )
          .then(function (userDetails) {
            return model.save(userDetails);
          });
        })
        .then(
          function (user) {
            if (user) {
              console.log('User', user.id, 'updated.');
            }

            if (options.callback) {
              return options.callback(null, user);
            }
          },
          function (err) {
            console.log('Err', err);

            if (options.callback) {
              return options.callback(err);
            }

            throw err.statusCode;
          }
        );
    });
  }
};
