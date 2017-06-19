/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TooltipView = Backbone.View.extend({
        template: JST['app/scripts/templates/tooltip.ejs'],

        tagName: 'div',

        id: 'tooltip',

        className: 'value-tooltip',

        events: {
            'mouseleave': 'closeTooltip',
            'touchend': 'closeTooltip'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.css('top', function () {
                return self.model.get('drawY');
            });
            this.$el.css('left', function () {
                return self.model.get('drawX');
            });
            this.$el.css('position', 'fixed');
        },
        closeTooltip: function () {
            this.el.remove();
            this.model.destroy();
        }
    });

    return TooltipView;
});
