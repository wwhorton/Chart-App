/*global define*/

define([
    'underscore',
    'backbone',
    'models/chart'
], function (_, Backbone, ChartModel) {
    'use strict';

    var ChartsCollection = Backbone.Collection.extend({
        model: ChartModel,
        initialize: function (models, options) {
            var model;
            this.url = options.url;
        }
    });

    return ChartsCollection;
});
