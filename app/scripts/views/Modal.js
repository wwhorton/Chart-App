/*global define*/

define([
    'underscore',
    'backbone',
    'templates',
    'chartjs',
    'chartjsStackedBar',
    'views/legend',
    'views/modal',
    'html2canvas',
    'views/GoalCollectionView',
    'views/TooltipView'
], function (_, Backbone, JST, ChartJS, chartjsStackedBar, LegendView, ModalView, html2canvas, GoalCollectionView, TooltipView) {

    jQuery.noConflict();
    var body = $('body');

    var ModalView = Backbone.View.extend({
        template: JST['app/scripts/templates/Chart-Modal.ejs'],

        tagName: 'div',

        id: function () {
            return 'chart-modal-' + this.model.get('id');
        },
        className: 'modal fade',

        attributes: {
            'tabindex': '-1'
        },

        events: {
            'shown-bs-modal': 'drawChartModal',
            'click .jpg-download': 'getPNG',
            'click .doc-download': 'docDownload',
            'click .xls-download': 'xlsDownload',
            'mousemove canvas': 'getPointValue',
            'touchstart canvas': 'getPointValue'
        },

        initialize: function () {
            _.bindAll(this, 'drawChartModal');
            this.listenTo(this.model, 'parsed', this.render);
            this.render();
            Chart.defaults.global.responsive = true;
            Chart.defaults.global.maintainAspectRatio = false;
            if ($(window).width() < 600) {
                Chart.defaults.global.maintainAspectRatio = false;
            }
            Chart.defaults.global.tooltipTemplate = "<%=numberWithCommas(value)%>";
            Chart.defaults.global.animation = true;

        },

        render: function () {
            this.delegateEvents(this.events);
            var id = this.id();
            var showLegend = this.model.get('showLegend');
            if (showLegend == "Yes") {
                setTimeout(function () {
                    this.legendView = new LegendView({model: this.model});
                }.bind(this), 0);
            }
            setTimeout(function () {
                $(this.el).html(this.template(this.model.toJSON()));
            }.bind(this), 0);
            body.append($(this.el));
            return this;
        },
        toggleModal: function () {
            $(this.el).modal('toggle');
            setTimeout(function () {
                this.$el.trigger('shown-bs-modal');
            }.bind(this), 600);
        },
        docDownload: function () {
            var windowObjRef = window.open(this.model.get('methods'));
        },
        xlsDownload: function () {
            var windowObjRef = window.open(this.model.get('spreadsheet'));
        },
        getChart: function (type, ctx, labels, data, array, goals, yAxisLabel, touching) {
            if (typeof ctx === 'undefined') {
                return;
            }
            var chart = {};
            var self = this;
            var options = {
                legendTemplate: JST['app/scripts/templates/Legend.ejs'],
                showTooltips: false,
                pointHitDetectionRadius: 20,
                showScale: true,
                scaleLabel: (function () {
                    var label = self.model.get('yAxisLabel') ? "          <%=numberWithCommas(value)%>" : "<%=numberWithCommas(value)%>";
                    return label;
                })()
            };
            if (this.model.get('maxY') != '') {
                options = {
                    legendTemplate: JST['app/scripts/templates/Legend.ejs'],
                    showTooltips: false,
                    scaleLabel: (function () {
                        return self.model.get('yAxisLabel') ? "        <%=numberWithCommas(value)%>" : "<%=numberWithCommas(value)%>";
                    })(),
                    scaleShowLabels: true,
                    scaleOverride: self.model.get('maxY') != '',
                    scaleSteps: parseInt(self.model.get('steps')),
                    scaleStartValue: parseInt(self.model.get('minY')),
                    scaleStepWidth: ( ( parseInt(self.model.get('maxY')) - parseInt(self.model.get('minY')) ) / parseInt(self.model.get('steps')) )
                };
            }
            switch (type) {
                case 'line chart':
                    options.bezierCurve = false;
                    chart = new ChartJS(ctx).LineGoal({
                        labels: labels,
                        datasets: array,
                        goals: goals,
                        yAxisLabel: yAxisLabel
                    }, options);
                    break;
                case 'pie chart':
                    options.showTooltips = false;
                    options.animationSteps = 40;
                    options.animationEasing = "easeOut";
                    chart = new ChartJS(ctx).Pie(data, options);
                    break;
                case 'pie chart (percentage)':
                    options.showTooltips = false;
                    options.animationSteps = 40;
                    options.animationEasing = "easeOut";
                    chart = new ChartJS(ctx).Pie(data, options);
                    break;
                case 'bar chart':
                    chart = new ChartJS(ctx).BarGoal({
                        labels: labels,
                        datasets: array,
                        goals: goals,
                        yAxisLabel: yAxisLabel,
                        touching: touching
                    }, options);
                    break;
                case 'stacked bar chart':
                    options.showTooltips = true;
                    options.showTotal = true;
                    options.multiTooltipTemplate = '<%= datasetLabel %>: <%=numberWithCommas( Math.floor( value * 100 ) / 100 )%>';
                    chart = new ChartJS(ctx).StackedBarGoal({
                        labels: labels,
                        datasets: array,
                        goals: goals,
                        yAxisLabel: yAxisLabel
                    }, options);
                    break;
                case 'radar chart':
                    chart = new ChartJS(ctx).Radar({labels: labels, datasets: array}, options);
                    break;
                case 'polar area chart':
                    options.showTooltips = true;
                    chart = new ChartJS(ctx).PolarArea(data, options);
                    break;
                case 'doughnut chart':
                    options.showTooltips = false;
                    options.animationEasing = "easeOut";
                    options.animationSteps = 40;
                    chart = new ChartJS(ctx).Doughnut(data, options);
                    break;
            }
            return chart;
        },
        setModalCanvas: function () {
            var canvas = $('#canvas-' + this.model.get('id') + '-modal') || null;
            if (canvas === null) {
                this.$el.remove();
                this.render();
                this.drawChartModal();
            } else {
                return canvas.get(0).getContext("2d");
            }
        },
        drawChartModal: function () {
            if (typeof this.chart !== 'undefined') {
                return;
            }
            var type = this.model.get('type');
            var ctx = this.setModalCanvas();
            var yAxisLabel = this.model.get('yAxisLabel');
            var touching = this.model.get('touching');
            if (this.model.get('datasets')) {
                var array = _.values(_.pluck(this.model.get('datasets').models, 'attributes'));
            }
            if (this.model.get('data')) {
                var data = _.values(_.pluck(this.model.get('data').models, 'attributes'));
            }
            if (this.model.get('goals')) {
                var goals = _.values(_.pluck(this.model.get('goals').models, 'attributes'));
            }
            var labels = _.values(this.model.get('chartLabel').attributes);
            this.chart = this.getChart(type, ctx, labels, data, array, goals, yAxisLabel, touching);
        },
        getPNG: function () {
            window.html2canvas = html2canvas;
            var getURL = function( thing ){
                return window.URL.createObjectURL( thing );
            };
            var self = this;
            var chartCapture = $(self.el).find('.chart-area:first-child');
            chartCapture.prepend('<h2 class="text-center" id="jpg-title">' + self.model.get('title') + '</h2>');
            html2canvas(chartCapture, {
                allowTaint: true
            }).then(function (canvas) {
                if( typeof canvas.toBlob == "function" ) {
                    canvas.toBlob(function (blob) {
                        var imgHref = getURL(blob);
                        var imgLink = document.createElement("a");
                        imgLink.href = imgHref;
                        imgLink.download = self.model.get('urlTitle') + ".jpg";
                        body.append(imgLink);
                        imgLink.click();
                        body.remove(imgLink);
                    });
                } else {
                    var blob = canvas.msToBlob();
                    var imgHref = getURL(blob);
                    var filename = self.model.get("urlTitle") + ".png";
                    var imgLink = document.createElement("a");
                    body.append(imgLink);
                    $( imgLink ).on( 'click', function( e ){
                        e.preventDefault();
                        window.navigator.msSaveBlob( blob, filename );
                    });
                    imgLink.click();
                    body.remove(imgLink);
                }
            });
            $('#jpg-title').remove();

        },
        getPointValue: function (event) {
            if (typeof this.chart === 'undefined') {
                return
            }
            var type = this.model.get('type');
            var position = ChartJS.helpers.getRelativePosition(event);
            if (type === 'line chart' || type === 'radar chart' || type === 'polar area chart') {
                var points = this.chart.getPointsAtEvent(event);

                var point = _.min(points, function (point) {
                    return Math.abs(point.y - position.y);
                });
                if ((Math.abs(event.offsetY - point.y) ) < 1 && ( event.offsetX == position.x )) {
                    this.drawTooltip(point, event);
                }
            } else if (type === 'stacked bar chart') {
                var bars = this.chart.getBarsAtEvent(event);
                var bar = _.find(bars, function (bar) {
                    return ( bar.y <= position.y && bar.base >= position.y );
                });
                if (typeof bar != 'undefined') {
                    //this.drawTooltip(bar, event);
                }
            } else if (type === 'bar chart') {
                var bars = this.chart.getBarsAtEvent(event);
                var bar = _.find(bars, function (bar) {
                    return ( ( bar.x - bar.width ) <= position.x && bar.x >= position.x );
                });
                if (typeof bar != 'undefined') {
                    this.drawTooltip(bar, event);
                }
            } else {
                if (typeof this.chart === 'undefined') {
                    return
                }
                var segments = this.chart.getSegmentsAtEvent(event);
                var segment = segments[0];
                if (typeof segment != 'undefined') {
                    this.drawTooltip(segment, event);
                }
            }
        },
        drawTooltip: function (point, position) {
            var tooltip = $('#tooltip');
            if (tooltip.length != 0) {
                tooltip.remove();
            }
                var DatumModel = Backbone.Model.extend({});
                var datum = new DatumModel(point);
                datum.set({'drawX': position.clientX - 10, 'drawY': position.clientY - 10});
                if (this.model.get('type') === 'stacked bar chart' || this.model.get('type') === 'bar chart') {
                    datum.set({'label': point.datasetLabel});
                }
            datum.set({'type': this.model.get('type')});
                var tooltipView = new TooltipView({model: datum});
                tooltipView.render();
                var id = this.id();
                $("#" + id).append(tooltipView.el);
        }
    });
    return ModalView;
});
