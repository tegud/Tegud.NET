(function () {
    var browserRating = TEGUD.registerNameSpace('TEGUD.Sidebar.BrowserRating'),
        _rating,
        _featureClass = {
            MajorFunctional: 5,
            MinorFunctional: 2,
            MajorPresenational: 3,
            MinorPresenational: 1
        };

    TEGUD.registerInit(function () {
        var sidebarModule = $('#BrowserRating'),
            rating = 0,
            maxRating = 0,
            features = [
                    {
                        Feature: 'csstransforms',
                        Class: 'MajorPresenational'
                    },
                    {
                        Feature: 'csstransitions',
                        Class: 'MajorPresenational'
                    },
                    {
                        Feature: 'cssanimations',
                        Class: 'MinorPresenational'
                    }
                ],
            featureLength = features.length,
            x,
            feature,
            featureRating,
            score = 0,
            scoreThreshold = 0.8;

        if ($.browser.msie && $.browser.version < 9) {
            rating = rating - 10;

            if ($.browser.version < 8) {
                rating = rating - 10;
            }
        }
        else {
            for (x = 0; x < featureLength; x++) {
                feature = typeof features[x] === 'string' ? features[x] : features[x].Feature;
                featureRating = features[x].Class === undefined || !_featureClass[features[x].Class] ? 5 : _featureClass[features[x].Class];
                maxRating += featureRating;

                if (Modernizr[feature]) {
                    rating += featureRating;
                }
            }
        }

        if (rating > 0) {

            if (maxRating === rating) {
                $('#BrowserMessage').text('Great! Your browser can handle everything this site can throw at it.');
                $('#SuggestedBrowsers').addClass('hiddenElement');
            }
            else if (maxRating > 0) {
                score = rating / maxRating;

                if (score > scoreThreshold) {
                    $('#BrowserMessage').text('Your browser supports everything this site needs functionally. It doesnt support everything, but it\'ll work just fine');
                    $('#SuggestedBrowsers').addClass('hiddenElement');
                }
            }
        }

        _rating = rating;
    });
})();