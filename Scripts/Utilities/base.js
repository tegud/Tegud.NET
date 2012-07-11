define(['tegud/base'], function () {
    TEGUD.Utilities = {};

    TEGUD.Utilities.CartesianPoint = function (x, y) {
        return {
            x: x,
            y: y,
            distanceTo: function (otherPoint) {
                var a, b, c;

                a = Math.abs(otherPoint.x - this.x);
                b = Math.abs(otherPoint.y - this.y);

                c = Math.sqrt((a * a) + (b * b));

                return c;
            }
        };
    };

    var monthMap = {
        'jan': 1,
        'feb': 2,
        'mar': 3,
        'apr': 4,
        'may': 5,
        'jun': 6,
        'jul': 7,
        'aug': 8,
        'sep': 9,
        'oct': 10,
        'nov': 11,
        'dec': 12,
        'janurary': 1,
        'february': 2,
        'march': 3,
        'april': 4,
        'june': 6,
        'july': 7,
        'august': 8,
        'september': 9,
        'october': 10,
        'november': 11,
        'december': 12
    };

    TEGUD.Utilities.GetMonthNumberFromName = function (name) {
        if (!name)
            return;

        return monthMap[name.toLowerCase()];
    };

    TEGUD.Utilities.GetMonthNameFromNumber = function (number) {
        return ['Janurary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][number];
    };

    TEGUD.Utilities.PadNumberForTime = function (input) {
        var inputString = input + '';
        
        return (inputString.length < 2) ? '0' + inputString : inputString;
    };

    TEGUD.Utilities.GetDaySuffix = function (date) {
        if (date === 1 || date === 21 || date === 31) {
            return 'st';
        }

        if (date === 2 || date === 22) {
            return 'nd';
        }

        if (date === 3 || date === 23) {
            return 'rd';
        }

        return 'th';
    };

    /*
    * JavaScript Pretty Date
    * Copyright (c) 2008 John Resig (jquery.com)
    * Licensed under the MIT license.
    */

    // Takes an ISO time and returns a string representing how
    // long ago the date represents.
    TEGUD.Utilities.PrettyDate = function (time) {
        var date = new Date((time || "")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff))
            return;
        else if (day_diff < 0)
            return "just now";

        return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 31 && day_diff + " days ago" ||
		Math.ceil(day_diff / 7) + " weeks ago";
    };

    TEGUD.Utilities.Url = {
        setFragment: function (url, fragment) {
            var hashPosition = url.indexOf('#');

            if (hashPosition < 0) {
                return url + '#' + fragment;
            }

            return url.substring(0, hashPosition + 1) + fragment;
        },
        getFragment: function (url) {
            var hashPosition = url.indexOf('#');

            if (hashPosition < 0) {
                return '';
            }

            return url.substring(hashPosition + 1);
        }
    };

    $.fn.bindTransitionEndEvents = function (functionToBind) {
        var _bindEventToElement = function (element) {
            element.addEventListener("transitionend", functionToBind, true);
            element.addEventListener("webkitTransitionEnd", functionToBind, true);
            element.addEventListener("OTransitionEnd", functionToBind, true);
        };

        return this.each(function () {
            _bindEventToElement(this);
        });
    };
});