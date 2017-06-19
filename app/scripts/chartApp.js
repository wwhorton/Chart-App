/**
 * Created by Bill on 8/21/2015.
 */
define(['underscore', 'views/ChartsCollection', 'collections/Charts'], function (_, ChartsCollectionView, ChartsCollection) {
    chartApp =
    {
        initialize: function () {

        },
        refresh: function () {
            "use strict";
            if (typeof this.chartsCollectionView === 'undefined') {
                return;
            }
            this.chartsCollectionView.trigger('refresh-collection');
        },
        rerender: function () {
            "use strict";
            this.chartsCollectionView.rerender();
        },
        drawCharts: function (container, modal) {
            var modal = modal || false;
            var title;
            var urlRoot = $(container).data('urlRoot');
            this.container = container;

            var chartsCollection = new ChartsCollection([], {url: urlRoot});
            var chartsCollectionView = new ChartsCollectionView({collection: chartsCollection, container: container});

            _.each($(container).find('div[data-chart-title]'), function (child, key, list) {
                title = $(child).data('chartTitle');
                chartsCollection.add({'id': title, 'modal': modal});
                $(child).remove();
            }, this);
            if ($(container).children().length > 0) {
                $(container + ' .slide-item:last-child').after(chartsCollectionView.el);
            } else {
                $(container).html(chartsCollectionView.el);
            }
            chartsCollectionView.trigger('finished');
            this.chartsCollectionView = chartsCollectionView;
            return this;
        }

    };
    return chartApp;
});
