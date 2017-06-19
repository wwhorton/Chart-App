/*global require*/
'use strict';

require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        chartjs: '../bower_components/Chart.js/Chart',
        chartjsStackedBar: '../bower_components/Chart.StackedBar.js/src/Chart.StackedBar',
        html2canvas: '../bower_components/html2canvas/dist/html2canvas.min'
    },
    map: {
        '*': {
            'chart.js': 'chartjs'
        }
    }
});


function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

require([
    'backbone', 'chartApp'
], function (Backbone, chartApp) {
    Backbone.history.start();
    chartApp.initialize();
});
