$.YQL = function (query, callback) {
    if (!query || !callback) {
        throw new Error('$.YQL(): Parameters may be undefined');
    }
    var encodedQuery = encodeURIComponent(query.toLowerCase()),
            url = 'http://query.yahooapis.com/v1/public/yql?q='
            + encodedQuery + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
    $.getJSON(url, callback);
};