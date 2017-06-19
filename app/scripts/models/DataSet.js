/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var DataSetModel = Backbone.Model.extend({

        initialize: function() {

        },

        defaults: {},

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return DataSetModel;
});
