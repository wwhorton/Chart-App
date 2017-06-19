/*global define*/

define([
    'underscore',
    'backbone',
    'collections/dataset',
    'models/labels',
    'collections/goalcollection'
], function (_, Backbone, DataSetCollection, LabelsModel, GoalCollection) {
    'use strict';

    var ChartModel = Backbone.Model.extend({

        defaults: {
            'rawData': {},
            'type': '',
            'modal': false,
            'title': '',
            'url-title': '',
            'shortTitle': '',
            'subtitle': '',
            'chartLabel': new LabelsModel(),
            'datasets': new DataSetCollection(),
            'spreadsheet': '',
            'methods': '',
            'legend': '',
            'showLegend': 'No',
            'goals': '',
            'total': '0',
            'touching': 'No'
        },
        initialize: function() {
            var self = this;
            self.fetch({dataType: 'jsonp'});
            this.trigger('initialized');
        },
        parseColor: function (colorName, opacity) {
            switch (colorName) {
                case 'Blue':
                    return '#26B7EB';
                case 'Green':
                    return '#86C255';
                case 'Light Blue':
                    return 'rgba( 0, 188, 242, ' + opacity + '  )';
                case 'Medium Blue':
                    return 'rgba( 0, 130, 181, ' + opacity + '  )';
                case 'Dark Blue':
                    return 'rgba( 15, 81, 111, ' + opacity + ' )';
                case 'Light Green':
                    return 'rgba( 182, 236, 120, ' + opacity + '  )';
                case 'Medium Green':
                    return 'rgba( 141, 195, 88, ' + opacity + '  )';
                case 'Dark Green':
                    return 'rgba( 107, 147, 67, ' + opacity + '  )';
                case 'Light Grey':
                    return 'rgba( 217, 225, 229, ' + opacity + '  )';
                case 'None':
                    return 'transparent';
                default :
                    return 'transparent';
            }
        },
        parse: function(response, options)  {
            var self = this;
            var array;
            this.set({
                'rawData': response,
                'title': response.title,
                'urlTitle': response.urlTitle,
                'shortTitle': response.shortTitle,
                'subtitle': response.subtitle,
                'chartLabel': new LabelsModel(response.labels),
                'datasets': new DataSetCollection(response.dataset),
                'data': new DataSetCollection(response.data),
                'spreadsheet': response.data_spreadsheet,
                'methods': response.analysis_methods_documentation,
                'type': response.type,
                'goals': new GoalCollection(response.goal),
                'showLegend': response.showLegend || 'no',
                'yAxisLabel': response.yAxisLabel,
                'maxY': response.maxY,
                'minY': response.minY || '0',
                'steps': response.steps || '10',
                'touching': response.touching
            });
            if (this.get('datasets').length > 0 && response.type === 'line chart') {
                array = this.get('datasets');
                _.each(array.models, function (dataset) {
                    dataset.set({'fillColor': this.parseColor(dataset.get('fillColor'), '.5')});
                    dataset.set({'strokeColor': this.parseColor(dataset.get('strokeColor'), '1')});
                    dataset.set({'pointColor': this.parseColor(dataset.get('pointColor'), '1')});
                    dataset.set({'pointStrokeColor': this.parseColor(dataset.get('pointStrokeColor'), '1')});
                    dataset.set({'pointHighlightFill': this.parseColor(dataset.get('pointHighlightFill'), '.5')});
                    dataset.set({'pointHighlightStroke': this.parseColor(dataset.get('pointHighlightStroke'), '1')});
                }, this);


            } else if (this.get('datasets').length > 0 && response.type != 'line chart') {
                array = this.get('datasets');
                _.each(array.models, function (dataset) {
                    dataset.set({'fillColor': this.parseColor(dataset.get('fillColor'), '1')});
                    dataset.set({'strokeColor': this.parseColor(dataset.get('strokeColor'), '1')});
                    dataset.set({'pointColor': this.parseColor(dataset.get('pointColor'), '1')});
                    dataset.set({'pointStrokeColor': this.parseColor(dataset.get('pointStrokeColor'), '1')});
                    dataset.set({'pointHighlightFill': this.parseColor(dataset.get('pointHighlightFill'), '1')});
                    dataset.set({'pointHighlightStroke': this.parseColor(dataset.get('pointHighlightStroke'), '1')});
                }, this);
            }
            if (this.get('data').length > 0) {
                array = this.get('data');
                _.each(array.models, function (data) {
                    data.set({'color': this.parseColor(data.get('color'), '1')});
                    data.set({'highlight': this.parseColor(data.get('highlight'), '1')});
                }, this);
            }
            if (this.get('goals')) {
                array = this.get('goals');
                _.each(array.models, function (goal) {
                    goal.set({'goalColor': this.parseColor(goal.get('goalColor'), '1')});
                }, this);
            }
            setTimeout(function () {
                self.trigger('parsed');
            }, 0);
        }
    });
    return ChartModel;
});
