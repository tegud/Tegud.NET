define(['utilities/pubsub', 'librarian/parameters', 'librarian/data', 'librarian/grid', 'librarian/controls'], function () {
    var l = TEGUD.Librarian,
        utilities = TEGUD.Utilities,
        publish = utilities.publish,
        subscribe = utilities.subscribe,
        gridAttachedDeferred = $.Deferred(),
        librarianParameters = new l.Parameters(),
        librarianData = new l.Data(librarianParameters),
        setParameters = function () {
            librarianParameters.set.apply(this, arguments);
        };

    $.extend(l, {
        bindGrid: function (gridElement) {
            var currentData,
                grid = new TEGUD.Librarian.Grid(gridElement);

            gridAttachedDeferred.resolve();

            subscribe('Tegud.Librarian.DataLoaded', function (e, data) {
                grid.render(data);
            });

            currentData = librarianData.getLastUpdate();

            if (currentData) {
                grid.render(currentData);
            }

            return this;
        },
        bindControls: function (controlsContainer) {
            new TEGUD.Librarian.Controls(controlsContainer, librarianParameters);

            return this;
        },
        setParameters: setParameters
    });
});
