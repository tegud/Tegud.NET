define(['tegud/base'], function () {
    TEGUD.Flickr = (function () {
        console.log('Flickr module loaded');

        return {
            loadPhotoSet: function (callback) {
                $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d4f20e9b6e703f8653939a2a99eaa0be&photoset_id=72157629808026283&extras=url_m%2Curl_o%2Curl_t%2Curl_sq%2Curl_l%2Cdate_taken&format=json&nojsoncallback=1', function (data) {
                    console.log('Flickr feed data loaded');

                    if (data.code && data.code == 100) {
                        TEGUD.Utilities.publish('TEGUD.Flickr.PhotosLoadFailed', data.message);
                        return;
                    }

                    if (callback && $.isFunction(callback)) {
                        callback(data.photoset);
                    }

                    TEGUD.Utilities.publish('TEGUD.Flickr.PhotosLoaded', data.photoset);
                });
            }
        };
    })();
});
