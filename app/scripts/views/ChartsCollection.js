/*global define*/

define([
    'underscore',
    'backbone',
    'templates',
    'views/chart'
], function (_, Backbone, JST, ChartView) {
    'use strict';

    var ChartsCollectionView = Backbone.View.extend({
        template: JST['app/scripts/templates/ChartsCollection.ejs'],

        tagName: 'div',

        id: 'charts-collection',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this, 'finished', this.render);
            this.listenTo(this, 'refresh-collection', this.refresh);
            this.views = [];
        },

        refresh: function () {
            _.each(this.views, function (view) {
                view.chart.destroy();
                view.chart.render();
            });

        },
        rerender: function () {
            this.render();
        },

        render: function () {
            var self = this;
            this.collection.each(function (item, key, list) {
                var chartView = new ChartView({model: item});
                this.$el.parent().prepend(chartView.render().el);
                chartView.on('chartDrawn', function () {
                    if (key === list.length - 1) {
                        $(chartApp.container).triggerHandler('lastChartDrawn');
                        chartView.off('chartDrawn');
                    }
                });
                this.views.push(chartView);
            }.bind(this));
            this.$el.remove();
            return this;
        }
    });

    return ChartsCollectionView;
});
