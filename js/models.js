var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var Query = Backbone.Model.extend ({
    defaults: {data: ""}
  });

module.exports = {
	Query: Query
};