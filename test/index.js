'use strict';

var _ = require('underscore'),
  config = require('../config'),
  Bromise = require('bluebird'),
  nock = require('nock'),
  jwt = require('jsonwebtoken'),
  chance = new (require('chance'))(),
  amqp = require('amqplib-easy')(config.amqp.url),
  userChangesListener = require('../index.js'),
  User = require('./User'),
  Bookshelf = require('./bookshelf');

describe('establish amqp', function () {
  var Model = Bookshelf.Model.extend({
      tableName: 'users',
      hasTimestamps: true
    });

  before(function () {

    Bromise.resolve()
      .then(function () {
        return jwt.sign(
          {
            id: chance.integer({ min: 1, max: 10000 })
          },
          config.privateKey,
          {
            algorithm: 'RS256',
            issuer: 'urn:lanetix/auth',
            audience: 'urn:lanetix/api'
          }
        );
      })
      .then(function (token) {
        nock(config.authUri)
          .persist()
          .post('/tokens')
          .reply(200, {
            token: token
          });
      });

    return new Model()
      .fetchAll()
      .get('models')
      .map(function (user) {
        return user.destroy();
      });
  });

  it('should send to queue and save to db', function (done) {

    var queue = chance.guid(),
      user = {
          id: chance.integer({ min: 1, max: 100000 }),
          organization_id: chance.integer({ min: 1, max: 100000 }),
          avatar_url: 'https://secure.lanetix.com/css/images/default-avatar.png',
          name: chance.name()
        };

    return Bromise.resolve()
      .then(function () {
        return new Model()
          .save(user);
      })
      .then(function (model) {
        user = model.toJSON();

        nock(config.apiUri)
          .get('/users/' + user.id)
          .reply(200, _.defaults({ name: chance.name(), fauxName: chance.name() }, user));

        return userChangesListener
          .start({ User: User, queue: queue, durable: false, callback: done })
          .then(function () {
            return Bromise.all([
              amqp.sendToQueue(_.defaults({ queue: queue, queueOptions: { durable: false } }, config.amqp), { user_id: user.id, item_id: user.id, organization_id: user.organization_id })
            ]);
          });
      });
  });

  it('should send to queue but not save to db', function (done) {

    var queue = chance.guid(),
      userId = chance.integer({ min: 1, max: 100000 }),
      organizationId = chance.integer({ min: 1, max: 100000 });

    return userChangesListener
      .start({ User: User, queue: queue, durable: false, callback: function (model) {
          try {
            done();
            return (model === null).should.be.ok;
          } catch (err) { done(err); }
        }
      })
      .then(function () {
        return Bromise.all([
          amqp.sendToQueue(_.defaults({ queue: queue, queueOptions: { durable: false } }, config.amqp), { user_id: userId, item_id: userId, organization_id: organizationId })
        ]);
      });
  });
});
