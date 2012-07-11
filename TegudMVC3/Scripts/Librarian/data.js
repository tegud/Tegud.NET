define(['librarian/base', 'utilities/pubsub'], function () {
    var utilities = TEGUD.Utilities,
        publish = utilities.publish,
        subscribe = utilities.subscribe;

    TEGUD.Librarian.Data = function (librarianParameters) {
        var lastData,
            addItem = function (event, newItem) {
                $.ajax({
                    url: '/api/librarian',
                    data: newItem,
                    type: 'POST',
                    success: function () {
                        console.log('Item added...');

                        publish('Tegud.Librarian.ItemAdded', newItem);
                    }
                });
            },
            update = function() {
                if (librarianParameters.wouldReturnEmptySet()) {
                    publish('Tegud.Librarian.DataLoaded', []);
                    return;
                }

                var librarianParams = librarianParameters.get();

                console.log('Loading stuff items, with parameters: ' + JSON.stringify(librarianParams));

                $.ajax({
                    url: '/api/librarian',
                    data: librarianParams,
                    success: function(data) {
                        console.log('Stuff items loaded');
                        lastData = data;
                        publish('Tegud.Librarian.DataLoaded', data);
                    }
                });
            };

        subscribe('Tegud.Librarian.ParametersUpdated', update);
        subscribe('Tegud.Librarian.AddItem', addItem);

        return {
            getItems: update,
            getCategories: function () {
                return;
            },
            getLastUpdate: function () {
                return lastData;
            }
        };
    };
});