define(['tegud/base', 'flickr/base'], function () {
    function MediaGroup(name) {
        var numberOfItems = 0,
            orderedSubGroups = [],
            subGroups = {},
            media = [],
            allMedia = [],
            addOrGetGroup = function (name) {
                var group;

                if (!(group = subGroups[name])) {
                    group = subGroups[name] = new MediaGroup(name);
                    orderedSubGroups[orderedSubGroups.length] = name;
                }

                return group;
            };

        return {
            addMedia: function () {
                var argumentsArray = Array.prototype.slice.call(arguments);

                numberOfItems++;

                if (typeof arguments[0] === 'string') {
                    addOrGetGroup(arguments[0]).addMedia.apply(this, Array.prototype.slice.call(arguments, [1]));
                }
                else {
                    media[media.length] = arguments[0];
                }

                allMedia[allMedia.length] = argumentsArray[argumentsArray.length - 1];
            },
            getGroups: function () {
                return $.map(orderedSubGroups, function (groupName) {
                    return subGroups[groupName];
                });
            },
            getAllContainedMedia: function () {
                return allMedia;
            },
            getMediaForGroup: function () {
                return media;
            },
            getHeaderImage: function () {
                var randomImageIndex = Math.floor(Math.random() * allMedia.length);

                return allMedia[randomImageIndex].medium;
            },
            name: name
        };
    }

    function FlickrImage(data, suffix) {
        return {
            url: data['url_' + suffix],
            width: parseInt(data['width_' + suffix], 10),
            height: parseInt(data['height_' + suffix], 10)
        };
    }

    TEGUD.Flickr.yearMonthGroupedPhotoStore = function () {
        var x = 0,
            group = function (media) {
                var topLevelGroup = new MediaGroup('Rory'),
                    mediaLength = media.length,
                    mediaItem,
                    mediaYearAdded,
                    mediaMonthAdded;

                for (x = 0; x < mediaLength; x++) {
                    mediaItem = media[x];
                    mediaYearAdded = (mediaItem.date.getUTCFullYear()) + '';
                    mediaMonthAdded = TEGUD.Utilities.GetMonthNameFromNumber(mediaItem.date.getUTCMonth());

                    topLevelGroup.addMedia(mediaYearAdded, mediaMonthAdded, mediaItem);
                }

                console.log(topLevelGroup);

                TEGUD.Utilities.publish('TEGUD.Flickr.GroupedPhotosLoaded', topLevelGroup);
            };

        TEGUD.Utilities.subscribe('TEGUD.Flickr.PhotosLoaded', function (m, data) {
            var photos = [],
				photoLength = data.photo.length,
				x = 0,
                splitPhotoDateAndTime,
				photoDate,
				photoTime,
				splitPhotoDate;

            console.log('Items loaded: ' + data.photo.length);

            for (; x < photoLength; x++) {
                splitPhotoDateAndTime = data.photo[x].datetaken.split(' ');
                splitPhotoDate = splitPhotoDateAndTime[0].split('-');
                photoDate = new Date(splitPhotoDate[0], splitPhotoDate[1] - 1, splitPhotoDate[2]),
                photoTime = splitPhotoDate[1];

                photos[photos.length] = {
                    type: 'photo',
                    date: photoDate,
                    time: photoTime,
                    original: new FlickrImage(data.photo[x], 'o'),
                    large: new FlickrImage(data.photo[x], 'l'),
                    medium: new FlickrImage(data.photo[x], 'm'),
                    small: new FlickrImage(data.photo[x], 's'),
                    thumbnail: new FlickrImage(data.photo[x], 't'),
                    square: new FlickrImage(data.photo[x], 'sq'),
                    title: data.photo[x].title
                };
            }

            group(photos);
        });
    };
});