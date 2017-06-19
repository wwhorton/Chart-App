/*global define*/

define([
    'underscore',
    'backbone',
    'models/DataSet'
], function (_, Backbone, DataSetModel) {
    'use strict';

    var DataSetCollection = Backbone.Collection.extend({
        model: DataSetModel

    });

    return DataSetCollection;
});
