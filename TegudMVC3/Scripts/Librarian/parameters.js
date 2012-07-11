define(['librarian/base', 'utilities/pubsub'], function () {
    var utilities = TEGUD.Utilities,
        publish = utilities.publish,
        subscribe = utilities.subscribe;

    TEGUD.Librarian.Parameters = function () {
        var librarianParameters,
            paramChangeDebounceTimeout,
            paramChangeDebounce = 250,
            set = function (name, categories, view) {
                if (paramChangeDebounceTimeout) {
                    clearTimeout(paramChangeDebounceTimeout);
                    paramChangeDebounceTimeout = null;
                }

                paramChangeDebounceTimeout = setTimeout(function () {
                    librarianParameters = {
                        name: name,
                        categories: categories,
                        categoryOrView: view
                    };

                    publish('Tegud.Librarian.ParametersUpdated', librarianParameters);
                }, paramChangeDebounce);
            };

        return {
            set: set,
            wouldReturnEmptySet: function () {
                if (typeof librarianParameters.categories !== 'undefined' && !librarianParameters.categories.length) {
                    return true;
                }

                return false;
            },
            get: function () {
                return librarianParameters || {};
            }
        };
    };
});