var TEGUD;

define(function () {
    var _initFunctions = [],
        _documentResizeEventAttached,
        _documentResizeEvents = [],
        _pageLoadDeferred,
        _setUpDocumentResizeEvent = function () {
            if (_documentResizeEventAttached) {
                return;
            }

            var throttlePageResize,
                pageResize = function () {
                    var resizeEventLengths = _documentResizeEvents.length,
                        x = 0;
                    if (resizeEventLengths) {
                        for (; x < resizeEventLengths; x++) {
                            _documentResizeEvents[x]();
                        }
                    }
                };

            $.when(TEGUD.pageLoadDeferred).then(function () {
                $(window).resize(function () {
                    if (throttlePageResize) {
                        clearTimeout(throttlePageResize);
                    }

                    throttlePageResize = setTimeout(pageResize, 250);
                });
            });

            _documentResizeEventAttached = true;
        },
        _pageWidthValid = function (operator, width) {
            var pageWidth = $('body').width();

            if (operator === '>') {
                return pageWidth >= width;
            }

            return pageWidth <= width;
        },
        _attachDocumentResizeEvent = function (operator, width, event) {
            _setUpDocumentResizeEvent();

            _documentResizeEvents[_documentResizeEvents.length] = function () {
                if (_pageWidthValid(operator, width)) {
                    event();
                }
            };
        },
        _getMediaMatchOperator = function (operator) {
            if (operator === '>') {
                return 'min';
            }

            return 'max';
        },
        _attachMediaMatchEvent = function (operator, width, event) {
            var mediaQuery = window.matchMedia('(' + _getMediaMatchOperator(operator) + '-width: ' + width + 'px)'),
                eventWrapper = function (mq) {
                    if (mq.matches) {
                        event();
                    }
                };

            mediaQuery.addListener(eventWrapper);
            event();
        };

    _pageLoadDeferred = $.Deferred();
    $(function () {
        console.log('Document ready called');
        _pageLoadDeferred.resolve();
    });

    //(function () {
    //    var consoleLog = (console || { log: function () { } }).log;
    //    console.log = function () {
    //        var args = Array.prototype.slice.call(arguments);

    //        if (!TEGUD.debugEnabled) {
    //            return;
    //        }

    //        consoleLog.apply(this, args);
    //    };
    //})();

    TEGUD = {
        registerNameSpace: function (ns) {
            var nsParts = ns.split(".");
            var root = window;

            for (var i = 0; i < nsParts.length; i++) {
                if (typeof root[nsParts[i]] == "undefined")
                    root[nsParts[i]] = new Object();

                root = root[nsParts[i]];
            }

            return root;
        },
        registerInit: function (initFunction, pageDataKey) {
            _initFunctions[_initFunctions.length] = {
                Init: initFunction,
                PageDataKey: pageDataKey
            };
        },
        attachMediaQueryEvent: function (operator, width, event) {
            if (window.matchMedia) {
                _attachMediaMatchEvent(operator, width, event);
            }
            else {
                _attachDocumentResizeEvent(operator, width, event);
            }
        },
        pageLoadDeferred: _pageLoadDeferred,
        init: function (pageData) {
            var initFunctionsLength = _initFunctions.length,
                x;

            for (x = 0; x < initFunctionsLength; x++) {
                if (_initFunctions[x] && _initFunctions[x].Init && $.isFunction(_initFunctions[x].Init)) {
                    if (_initFunctions[x].PageDataKey) {
                        _initFunctions[x].Init(pageData[_initFunctions[x].PageDataKey]);
                    }
                    else {
                        _initFunctions[x].Init();
                    }
                }
            }

            $('#login-providers')
                .delegate('li', 'click', function () {
                    var item = $(this);
                    
                    $('#login-hidden-field-holder')
                        .html($.map((item.data('openidParams') || {}), function (value, key) {
                            return '<input type="hidden" name="' + key + '" value="' + value + '" />';
                        }).join(''))
                        .parent()
                            .attr('action', '/Admin/' + item.data('action'))
                            .trigger('submit');
                });

            $('#SiteAuthentication')
                .bind('click', function () {
                    if ($(this).hasClass('LoggedOut')) {
                    }
                    else {
                        window.location = '/admin/logout';
                    }
                });
        }
    };
});