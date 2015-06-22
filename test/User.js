'use strict';

var _ = require('underscore'),
  Bookshelf = require('./bookshelf');

module.exports = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  format: function (attrs) {
    return _.pick(attrs, 'avatar_url', 'name');
  }
});
