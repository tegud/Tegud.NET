define(['tegud/base'], function () {
    TEGUD.Timeline = function (element, options) {
        var _elementHeight = element.height(),
            _show = function () {
                _toggleShow(0, true);
            },
            _hide = function () {
                _toggleShow(-_elementHeight + 20, true);
            },
            _toggleShow = function (newTop, animate) {
                if (animate) {
                    element.animate({
                        bottom: newTop
                    }, 500);
                } else {
                    element.css('bottom', newTop);
                }
            },
            startDate = options.limits.start,
            endDate = options.limits.end,
            timeDiff = ((endDate.getTime() - startDate.getTime()) / 1000),
            numberOfDays = Math.floor(timeDiff / 86400),
            timelineHtml = [],
            x = 0,
            y,
            setTimelineContent = function (mediaGroupedByDate) {
                var numberOfMonthsInData,
                    data = {
                        maxItems: 0,
                        months: []
                    },
                    currentDate,
                    mediaDateKey;

                for (x = 0; x <= numberOfDays; x++) {
                    currentDate = new Date(startDate.getTime() + (1000 * 60 * 60 * 24 * x));
                    mediaDateKey = currentDate.getUTCFullYear() + '-' + (currentDate.getUTCMonth() < 9 ? '0' : '') + (currentDate.getUTCMonth() + 1) + '-' + (parseInt(currentDate.getUTCDate(), 10) < 10 ? '0' : '') + currentDate.getUTCDate();

                    var mediaItem = mediaGroupedByDate[mediaDateKey];

                    console.log(mediaItem);
                }

                for (x = 0; x < numberOfMonthsInData; x++) {
                    var numberOfDaysInMonthData = data.months[x].days.length;
                    timelineHtml[timelineHtml.length] = '<ul class="timeline-segment">';

                    for (y = 0; y < numberOfDaysInMonthData; y++) {

                        var videosHeight = data.months[x].days[y].videos ? Math.ceil((data.months[x].days[y].videos / data.maxItems) * 100) : 0,
                            picturesHeight = data.months[x].days[y].pictures ? Math.ceil((data.months[x].days[y].pictures / data.maxItems) * 100) : 0,
                            spacerHeight = (!videosHeight && !picturesHeight) || videosHeight + picturesHeight >= 100 ? 0 : 100 - videosHeight - picturesHeight;

                        timelineHtml[timelineHtml.length] = '<li style="width: 10px;">';

                        if (videosHeight + picturesHeight > 100) {
                            var correction = videosHeight + picturesHeight - 100;

                            videosHeight = videosHeight - Math.floor(correction / 2);
                            picturesHeight = picturesHeight - Math.floor(correction / 2);

                            if (correction % 2) {
                                if (picturesHeight > videosHeight) {
                                    picturesHeight = picturesHeight - correction % 2;
                                } else {
                                    videosHeight = videosHeight - correction % 2;
                                }
                            }
                        }

                        if (videosHeight || picturesHeight) {
                            timelineHtml[timelineHtml.length] = '<div class="spacer" style="height: ' + spacerHeight + '%;"></div>';
                            if (videosHeight) {
                                timelineHtml[timelineHtml.length] = '<div class="videos" style="height: ' + videosHeight + '%;"></div>';
                            }
                            if (picturesHeight) {
                                timelineHtml[timelineHtml.length] = '<div class="pictures" style="height: ' + picturesHeight + '%;"></div>';
                            }
                        }


                        timelineHtml[timelineHtml.length] = '</li>';
                    }

                    timelineHtml[timelineHtml.length] = '</ul>';
                }

                element.html(timelineHtml.join(''));
            };

        TEGUD.Utilities.subscribe('TEGUD.Flickr.PhotosGroupedByDate', function (m, d) {
            setTimelineContent(d);
        });

        return {
            show: _show,
            hide: _hide
        };
    };
});