/*global define*/

define([
    'underscore',
    'backbone',
    'templates',
    'chartjs',
    'chartjsStackedBar',
    'views/legend',
    'views/modal'
], function (_, Backbone, JST, ChartJS, chartjsStackedBar, LegendView, ModalView) {
    Chart.types.Bar.extend({
        name: "BarGoal",
        initialize: function (data) {
            this.goals = data.goals;
            Chart.types.Bar.prototype.initialize.apply(this, arguments);
            this.yAxisLabel = data.yAxisLabel;
        },
        draw: function (ease) {
            var easingDecimal = ease || 1;
            var helpers = Chart.helpers;
            this.clear();
            var ctx = this.chart.ctx;
            this.scale.draw(easingDecimal);
            // Draws the y-axis title label
            if (typeof self.yAxisLabel != 'undefined') {
                ctx.save();
                // text alignment and color
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = this.options.scaleFontColor;
                // position
                var x = this.scale.xScalePaddingLeft * 0.3;
                var y = this.chart.height / 2;
                // change origin
                ctx.translate(x, y);
                // rotate text
                ctx.rotate(-90 * Math.PI / 180);
                ctx.fillText(this.yAxisLabel, -1.5, -1.5);
                ctx.restore();
            }
            var touching = this.touching;
            //Draw all the bars for each dataset
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                helpers.each(dataset.bars, function (bar, index) {
                    var spacing = ( touching == "Yes" ) ? 1 : 2;
                    if (bar.hasValue()) {
                        bar.base = this.scale.endPoint;
                        //Transition then draw
                        bar.transition({
                            x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
                            y: this.scale.calculateY(bar.value),
                            width: this.scale.calculateBarWidth(this.datasets.length) / spacing
                        }, easingDecimal).draw();
                    }
                }, this);

                //Draw goal lines
                var goalNumber, goalColor;
                var self = this;
                ctx.save();
                ctx.translate(0, 0);
                if (datasetIndex === this.datasets.length - 1) {
                    _.each(this.goals, function (goal) {
                        console.log( self.scale.width );
                        goalNumber = goal.goalValue.toLocaleString();
                        goalColor = goal.goalColor;
                        var width = self.scale.width;
                        var theY = self.scale.calculateY(goalNumber);
                        ctx.fillStyle = goalColor;
                        ctx.fillRect(self.scale.xScalePaddingLeft, theY, width, 5);
                        if (self.options.showScale === true) {
                            ctx.textAlign = "start";
                            ctx.textBaseline = "bottom";
                            ctx.fillStyle = self.options.scaleFontColor;
                            ctx.fillText(goal.goalName + ': ' + numberWithCommas(Math.floor(goalNumber * 100) / 100), self.scale.xScalePaddingLeft + 15, theY - 2);
                        }
                    });
                    ctx.restore();
                }
            }, this);
        }
    });
    Chart.types.StackedBar.extend({
        name: "StackedBarGoal",
        initialize: function (data) {
            this.goals = data.goals;
            this.yAxisLabelDrawn = false;
            Chart.types.StackedBar.prototype.initialize.apply(this, arguments);
            this.yAxisLabel = data.yAxisLabel;
        },
        draw: function (ease) {
            var easingDecimal = ease || 1;
            var helpers = Chart.helpers;
            this.clear();
            var self = this;
            var ctx = this.chart.ctx;
            this.scale.draw(easingDecimal);
            // Draws the y-axis title label
            if (typeof self.yAxisLabel != 'undefined') {
                ctx.save();
                // text alignment and color
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = this.options.scaleFontColor;
                // position
                var x = this.scale.xScalePaddingLeft * 0.3;
                var y = this.chart.height / 2;
                // change origin
                ctx.translate(x, y);
                // rotate text
                ctx.rotate(-90 * Math.PI / 180);
                ctx.fillText(this.yAxisLabel, -1.5, -1.5);
                ctx.restore();
            }
            //Draw all the bars for each dataset
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                helpers.each(dataset.bars, function (bar, index) {
                    var y = this.scale.calculateBarY(this.datasets, datasetIndex, index, bar.value),
                        height = this.scale.calculateBarHeight(this.datasets, datasetIndex, index, bar.value);
                    //Transition then draw
                    if (bar.value > 0) {
                        bar.transition({
                            base: this.scale.endPoint - (Math.abs(height) - Math.abs(y)),
                            x: this.scale.calculateBarX(index),
                            y: Math.abs(y),
                            height: Math.abs(height),
                            width: this.scale.calculateBarWidth(this.datasets.length) / 2
                        }, easingDecimal).draw();
                    }
                }, this);
                //Draw goal lines
                var goalNumber, goalColor;
                var self = this;
                ctx.save();
                ctx.translate(0, 0);
                if (datasetIndex === this.datasets.length - 1) {
                    _.each(this.goals, function (goal) {
                        console.log( self.scale.width );
                        goalNumber = goal.goalValue.toLocaleString();
                        goalColor = goal.goalColor;
                        var width = self.scale.width;
                        var theY = self.scale.calculateY(goalNumber);
                        ctx.fillStyle = goalColor;
                        ctx.fillRect(self.scale.xScalePaddingLeft, theY, width, 5);
                        if (self.options.showScale === true) {
                            ctx.textAlign = "start";
                            ctx.textBaseline = "bottom";
                            ctx.fillStyle = self.options.scaleFontColor;
                            ctx.fillText(goal.goalName + ': ' + numberWithCommas(Math.floor(goalNumber * 100) / 100), self.scale.xScalePaddingLeft + 15, theY - 2);
                        }
                    });
                    ctx.restore();
                }
            }, this);
        }
    });
    Chart.types.Line.extend({
        name: "LineGoal",
        initialize: function (data) {
            this.goals = data.goals;
            this.yAxisLabel = data.yAxisLabel;
            this.yAxisLabelDrawn = false;
            Chart.types.Line.prototype.initialize.apply(this, arguments);
        },
        draw: function (ease) {
            Chart.types.Line.prototype.draw.apply(this, arguments);
            var easingDecimal = ease || 1;
            var helpers = Chart.helpers;
            this.clear();
            var self = this;
            var ctx = this.chart.ctx;
            // Draws the y-axis title label
            if (typeof self.yAxisLabel != 'undefined') {
                ctx.save();
                // text alignment and color
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = this.options.scaleFontColor;
                // position
                var x = this.scale.xScalePaddingLeft * 0.3;
                var y = this.chart.height / 2;
                // change origin
                ctx.translate(x, y);
                // rotate text
                ctx.rotate(-90 * Math.PI / 180);
                ctx.fillText(this.yAxisLabel, -1.5, -1.5);
                ctx.restore();
            }
            // Some helper methods for getting the next/prev points
            var hasValue = function (item) {
                    return item.value !== null;
                },
                nextPoint = function (point, collection, index) {
                    return helpers.findNextWhere(collection, hasValue, index) || point;
                },
                previousPoint = function (point, collection, index) {
                    return helpers.findPreviousWhere(collection, hasValue, index) || point;
                };
            if (!this.scale) return;
            this.scale.draw();
            helpers.each(this.datasets, function (dataset) {
                var pointsWithValues = helpers.where(dataset.points, hasValue);
                //Transition each point first so that the line and point drawing isn't out of sync
                //We can use this extra loop to calculate the control points of this dataset also in this loop
                helpers.each(dataset.points, function (point, index) {
                    if (point.hasValue()) {
                        point.transition({
                            y: this.scale.calculateY(point.value),
                            x: this.scale.calculateX(index)
                        }, easingDecimal);
                    }
                }, this);
                // Control points need to be calculated in a separate loop, because we need to know the current x/y of the point
                // This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
                if (this.options.bezierCurve) {
                    helpers.each(pointsWithValues, function (point, index) {
                        var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
                        point.controlPoints = helpers.splineCurve(
                            previousPoint(point, pointsWithValues, index),
                            point,
                            nextPoint(point, pointsWithValues, index),
                            tension
                        );

                        // Prevent the bezier going outside of the bounds of the graph

                        // Cap puter bezier handles to the upper/lower scale bounds
                        if (point.controlPoints.outer.y > this.scale.endPoint) {
                            point.controlPoints.outer.y = this.scale.endPoint;
                        }
                        else if (point.controlPoints.outer.y < this.scale.startPoint) {
                            point.controlPoints.outer.y = this.scale.startPoint;
                        }

                        // Cap inner bezier handles to the upper/lower scale bounds
                        if (point.controlPoints.inner.y > this.scale.endPoint) {
                            point.controlPoints.inner.y = this.scale.endPoint;
                        }
                        else if (point.controlPoints.inner.y < this.scale.startPoint) {
                            point.controlPoints.inner.y = this.scale.startPoint;
                        }
                    }, this);
                }


                //Draw the line between all the points
                ctx.lineWidth = this.options.datasetStrokeWidth;
                ctx.strokeStyle = dataset.strokeColor;
                ctx.beginPath();
                helpers.each(pointsWithValues, function (point, index) {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    }
                    else {
                        if (this.options.bezierCurve) {
                            var previous = previousPoint(point, pointsWithValues, index);

                            ctx.bezierCurveTo(
                                previous.controlPoints.outer.x,
                                previous.controlPoints.outer.y,
                                point.controlPoints.inner.x,
                                point.controlPoints.inner.y,
                                point.x,
                                point.y
                            );
                        }
                        else {
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                }, this);

                if (this.options.datasetStroke) {
                    ctx.stroke();
                }

                if (this.options.datasetFill && pointsWithValues.length > 0) {
                    //Round off the line by going to the base of the chart, back to the start, then fill.
                    ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
                    ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
                    ctx.fillStyle = dataset.fillColor;
                    ctx.closePath();
                    ctx.fill();
                }

                //Now draw the points over the line
                //A little inefficient double looping, but better than the line
                //lagging behind the point positions
                helpers.each(pointsWithValues, function (point) {
                    point.draw();
                });
            }, this);
            //Draw the goal lines
            helpers.each(this.datasets, function (dataset, datasetIndex) {
                //Draw goal lines
                var goalNumber, goalColor;
                ctx.save();
                ctx.translate(0, 0);
                if (datasetIndex === this.datasets.length - 1) {
                    _.each(self.goals, function (goal) {
                        goalNumber = goal.goalValue.toLocaleString();
                        goalColor = goal.goalColor;
                        var width = self.scale.width - ( self.scale.xScalePaddingRight + self.scale.xScalePaddingLeft );
                        var theY = self.scale.calculateY(goalNumber);
                        ctx.fillStyle = goalColor;
                        ctx.fillRect(self.scale.startPoint + self.scale.yLabelWidth, theY, width, 5);
                        if (self.options.showScale === true) {
                            ctx.textAlign = "center";
                            ctx.textBaseline = "bottom";
                            ctx.fillStyle = self.options.scaleFontColor;
                            ctx.fillText(goal.goalName + ': ' + numberWithCommas(Math.floor(goalNumber * 100) / 100), self.scale.startPoint + 200, theY - 2);
                        }
                    });
                    ctx.restore();
                }
            }, this);

        }
    });

    var ChartView = Backbone.View.extend({

        tagName: 'div',

        className: 'slide-item col-xs-12 col-sm-6',

        events: {
            'click .chart-area': 'showModal',
            'click .expand': 'showModal',
            'click .doc-download': 'docDownload',
            'click .xls-download': 'xlsDownload',
            'click .jpg-download': 'getPNG'
        },

        id: function () {
            return this.model.get('id');
        },
        initialize: function () {
            this.template = JST['app/scripts/templates/Chart.ejs'];
            this.listenTo(this.model, 'parsed', this.render);
            this.listenTo(this, 'rendered', this.drawChart);
            this.chart = {};
            Chart.defaults.global.responsive = true;
            Chart.defaults.global.maintainAspectRatio = false;
            Chart.defaults.global.showTooltips = true;
            Chart.defaults.global.onAnimationComplete = function () {
                this.trigger('chartDrawn');
            }.bind(this);
            Chart.defaults.global.scaleFontFamily = "'utopia-std', Georgia, Charter, serif";
            Chart.defaults.global.tooltipFontFamily = "'utopia-std', Georgia, Charter, serif";
            Chart.defaults.global.tooltipTitleFontFamily = "'utopia-std', Georgia, Charter, serif";
            Chart.defaults.global.scaleFontColor = '#000000';
            Chart.defaults.global.scaleFontSize = 18;
            Chart.defaults.global.animation = false;
            jQuery.noConflict();
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.modalView = new ModalView({model: this.model});
            setTimeout(function () {
                this.trigger('rendered');
            }.bind(this), 0);
            return this;
        },
        docDownload: function () {
            var windowObjRef = window.open(this.model.get('methods'));
        },
        xlsDownload: function () {
            var windowObjRef = window.open(this.model.get('spreadsheet'));
        },
        showModal: function () {
            jQuery.noConflict();
            this.modalView.toggleModal();
        },
        drawChart: function(){
            var type = this.model.get('type');
            var ctx = this.setCanvas();
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
            this.chart.type = this.model.get('type');
            this.model.set({'chart': this.chart});
            if (typeof this.chart.generateLegend != 'undefined') {
                this.model.set({'legend': this.chart.generateLegend()});
            }
            this.trigger('chartDrawn');
        },
        setCanvas: function () {
            var id = this.id();
            return $('#canvas-' + id).get(0).getContext("2d");
        },
        getChart: function (type, ctx, labels, data, array, goals, yAxisLabel, touching) {
            var chart = {};
            var self = this;
            var options = {
                legendTemplate: JST['app/scripts/templates/Legend.ejs'],
                showTooltips: false,
                tooltipTemplate: "<%= value %>",
                showScale: false,
                animation: false,
                scaleLabel: (function () {
                    var label = self.model.get('yAxisLabel') ? "          <%=value%>" : "<%=value%>";
                    return label;
                })()

            };
            if (this.model.get('maxY') != '') {
                options = {
                    legendTemplate: JST['app/scripts/templates/Legend.ejs'],
                    showTooltips: false,
                    showScale: false,
                    animation: false,
                    scaleLabel: (function () {
                        return self.model.get('yAxisLabel') ? "          <%=value%>" : "<%=value%>";
                    })(),
                    scaleOverride: self.model.get('maxY') != '',
                    scaleSteps: parseInt(self.model.get('steps')),
                    scaleStartValue: parseInt(self.model.get('minY')),
                    scaleStepWidth: ( ( parseInt(self.model.get('maxY')) - parseInt(self.model.get('minY')) ) / parseInt(self.model.get('steps')) )
                };
            }
            if (window.innerWidth > 600) {
                options.scaleShowLabels = true;
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
                    chart = new ChartJS(ctx).Pie(data, options);
                    break;
                case 'pie chart (percentage)':
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
                    chart = new ChartJS(ctx).PolarArea(data, {
                        legendTemplate: JST['app/scripts/templates/Legend.ejs']
                    });
                    break;
                case 'doughnut chart':
                    chart = new ChartJS(ctx).Doughnut(data, options);
                    break;
            }
            return chart;
        },
        getPNG: function () {
            this.showModal();
            setTimeout(function () {
                this.modalView.getPNG();
            }.bind(this), 2000);
        }
    });
return ChartView;
});
