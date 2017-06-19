/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var GoalCollectionView = Backbone.View.extend({
        template: JST['app/scripts/templates/GoalCollectionView.ejs'],

        tagName: 'div',

        id: '',

        className: 'col-xs-12 text-center goal-legend',

        events: {},

        initialize: function () {
            this.listenTo(this.collection, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template({goals: this.collection.toJSON()}));
        }
    });

    return GoalCollectionView;
});
