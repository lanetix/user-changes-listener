'use strict';

var _ = require('underscore'),
  bookshelf = require('bookshelf'),
  knex = require('knex'),
  knexConfiguration = require('./knex'),
  repository = bookshelf(knex(knexConfiguration));

repository.plugin('virtuals');
repository.plugin('visibility');

module.exports = _.extend(repository, {
  createOrUseTransaction: function (transaction, cb) {
    if (transaction) {
      return cb(transaction);
    } else {
      return this.transaction(function (transaction) {
        return cb(transaction);
      });
    }
  }
});
