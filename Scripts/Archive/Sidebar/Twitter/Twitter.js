(function () {
    var _getTweets = function (username, callback) {
        $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=tegud&count=25&callback=?', callback);
    },
        url_regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi,
        replacer = function (regex, replacement) {
            return function (string) {
                return string.replace(regex, replacement);
            };
        },
        linkUrl = replacer(url_regexp, function (match) {
            var url = (/^[a-z]+:/i).test(match) ? match : "http://" + match;
            return '<a href="' + url + '" target="_blank">' + match + '</a>';
        }),
        linkUser = replacer(/@(\w+)/gi, '@<a href="http://twitter.com/$1" target="_blank">$1</a>'),
        linkTweet = function (text) {
            return linkTweet(text);
        };

    TEGUD.registerInit(function () {
        var tile = $('#Twitter'),
            tweets = [],
            user = tile.data('tegudTwitterUser'),
            autoRefresh = tile.data('tegudTileTwitterAutoRefresh'),
            container = tile.children('div'),
            article = container.children('article'),
            dates = container.children('.TweetDates'),
            dateMetroHeader,
            headerLeftOffset = dates.position().left,
            loadingDiv = tile.children('.Loading'),
            errorDiv = tile.children('.Error'),
            getTweets,
            toggleInfo = function (div, showPos, hidePos, show, onComplete) {
                var callback;

                if (show) {
                    // Already visible.
                    if (!div.hasClass('hiddenElement')) {
                        if (onComplete && $.isFunction(onComplete)) {
                            onComplete();
                        }
                        return;
                    }

                    div.css('left', hidePos).removeClass('hiddenElement');
                } else {
                    // Already hidden.
                    if (div.hasClass('hiddenElement')) {
                        if (onComplete && $.isFunction(onComplete)) {
                            onComplete();
                        }
                        return;
                    }

                    callback = function () {
                        div.addClass('hiddenElement');
                    };
                }

                div.animate({
                    left: show ? showPos : hidePos
                },
                    250,
                    function () {
                        if (callback && $.isFunction(callback)) {
                            callback();
                        }

                        if (onComplete && $.isFunction(onComplete)) {
                            onComplete();
                        }
                    });
            },
            toggleArticle = function (show, callback) {
                toggleInfo(article, 5, 280, show, callback);
                toggleInfo(dates, 5, 280, show);
            },
            toggleError = function (show, callback) {
                toggleInfo(errorDiv, 35, 280, show, callback);
            },
            toggleLoading = function (show, callback) {
                // Hide the error div if we're showing the loading one.
                if (show) {
                    toggleError(false, function () {
                        container.children('.TweetControl').addClass('hiddenElement');

                        toggleInfo(loadingDiv, 65, 280, show, callback);
                    });
                } else {
                    toggleInfo(loadingDiv, 65, 280, show, function () {
                        container.children('.TweetControl:not(.Latest)').removeClass('hiddenElement');

                        if (callback && $.isFunction(callback)) {
                            callback();
                        }
                    });
                }
            },
            selectTweet = function (previousItem, force) {
                var item = $(this).addClass('Current'),
                    newLeft = item.position().left,
                    tweetIndex = item.data('tegudTwitterIndex'),
                    returnArticle = function (moveForwards) {
                        article
                            .css({
                                'left': moveForwards ? -article.width() : article.width()
                            })
                            .html(linkUser(linkUrl(tweets[tweetIndex].Status)))
                            .animate({
                                'left': headerLeftOffset
                            }, 250);
                    };

                if (previousItem && previousItem.length) {
                    previousItem.removeClass('Current');
                    container.children('article').animate({
                        'left': headerLeftOffset + (previousItem.index() > item.index() ? article.width() : -article.width())
                    }, 250, function () {
                        returnArticle(previousItem.index() > item.index());
                    });
                } else {
                    returnArticle(false);
                }


                $('div > .TweetControl', tile)
                    .filter('.Latest')[tweetIndex > 0 ? 'removeClass' : 'addClass']('hiddenElement');
            };

        $(tile)
                .delegate('.TweetControl', 'click', function () {
                    var button = $(this),
                        firstItem,
                        newLeftPosition = dates.position().left;

                    if (button.hasClass('Refresh')) {
                        getTweets(true);
                    }
                    else if (button.hasClass('Latest')) {
                        // To navigate to the "latest" tweet, we find out if it's close to go forwards or backwards.
                        var itemsUntilFirst = dates.children('.Current').nextUntil('.First').size(),
                            cutOffPoint = dates.children().size() / 2;

                        // If we're going forwards then we can just trigger the click.
                        if (itemsUntilFirst <= cutOffPoint) {
                            dates.children('.First').trigger('click');
                        }
                        else {
                            // If we're not then we need to grab the items between the current and the first items, and 
                            firstItem = dates.children('.First');
                            firstItem.nextAll().prependTo(dates);
                            firstItem.prependTo(dates);

                            // Shift the dates ul to the correct position.
                            dates.children('.Current').prevAll().each(function () {
                                newLeftPosition += $(this).outerWidth();
                            });
                            dates.css('left', -newLeftPosition);

                            // trigger the shift to the first item.
                            firstItem.trigger('click');
                        }
                    }
                    else {
                        dateMetroHeader[button.hasClass('Prev') ? 'moveToPrevious' : 'moveToNext']();
                    }
                });

        // Bind what to do when an item is selected.
        dates.delegate('li', 'selectItem', function (e, previousItem) {
            selectTweet.call(this, $(previousItem));
        });

        dateMetroHeader = TEGUD.Metro.Header(dates);

        // The refresh function.
        (getTweets = function (showLoad) {
            if (showLoad || typeof showLoad === 'undefined') {
                toggleArticle(false, function () {
                    dates.html('');
                    article.html('');
                    toggleLoading(true);
                });
            }

            // Retrieve the data.
            _getTweets(user, function (data) {
                // Deal with errors.
                if (!data || !data.length) {
                    // Hide the loader
                    toggleLoading(false, function () {
                        // Show error.
                        toggleError(true);
                    });

                    return;
                }

                // Load the data into the array of tweets.
                tweets = $.map(data, function (item) {
                    return {
                        Date: TEGUD.Utilities.PrettyDate(item.created_at.replace('+', 'UTC+')),
                        Status: item.text
                    };
                });

                // Set the tweet date header.
                dates
                    .css('width', 120 * tweets.length)
                    .html($.map(tweets, function (item, i) {
                        return '<li' + (i ? '' : ' class="First"') + ' data-tegud-twitter-index="' + i + '">' + item.Date + '</li>';
                    }).join(''));

                // Hide the loader
                toggleLoading(false, function () {
                    toggleArticle(true, function () {
                        // Select the first tweet.
                        selectTweet.call(dates.children(':first'), false, true);
                    });
                });

                // Set the next refresh (if we are set to auto-refresh).
                if (autoRefresh) {
                    setTimeout(function () {
                        getTweets(true);
                    }, autoRefresh);
                }
            });
        })();
    });
})();