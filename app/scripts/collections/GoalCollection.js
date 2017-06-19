/*global define*/

define([
    'underscore',
    'backbone',
    'models/Goal'
], function (_, Backbone, Goal) {
    'use strict';

    var GoalCollection = Backbone.Collection.extend({
        model: Goal
    });

    return GoalCollection;
});
