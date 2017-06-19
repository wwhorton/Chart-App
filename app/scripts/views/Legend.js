/*global define*/

define([
    'underscore',
    'backbone',
    'templates'
], function (_, Backbone, JST) {
    'use strict';
    var LegendView = Backbone.View.extend({
        template: JST['app/scripts/templates/Legend.ejs'],
        tagName: 'div',
        initialize: function () {
            this.render();
        },
        render: function () {
            this.legend = this.model.get('legend');
            this.id = this.model.get('id');
            $('#legend-' + this.id).html(this.legend);
            $('#legend-modal-' + this.id).html(this.legend);
        }
    });
    return LegendView;
});
