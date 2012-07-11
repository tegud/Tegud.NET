(function () {
    TEGUD.overlay = (function () {
        var overlay,
            _body,
            _document,
            _window,
            _hide = function () {
                overlay.removeClass('Initialised');
            },
            appendOverlayIfRequired = function () {
                if (overlay) {
                    return;
                }

                overlay = $('<div />', {
                    id: 'TegudOverlay'
                })
                    .appendTo($('body'))
                    .bindTransitionEndEvents(function () {
                        if (overlay.hasClass('Initialised')) {
                            return;
                        }

                        overlay.addClass('hiddenElement');
                    });
            },
            sizeToWindow = function () {
                if (!overlay) {
                    return;
                }

                overlay.css({
                    width: _window.width(),
                    height: _window.height()
                });
            };

        TEGUD.registerInit(function () {
            _body = $('body').delegate('#TegudOverlay', 'click', function () {
                _hide();
            });
            _document = $(document);
            _window = $(window);
        });

        return {
            show: function (showCallback) {
                appendOverlayIfRequired();

                overlay
                    .removeClass('hiddenElement');

                setTimeout(function() {
                    overlay
                        .addClass('Initialised');
                }, 50);

                sizeToWindow();

                if (showCallback && $.isFunction(showCallback)) {
                    showCallback();
                }
            },
            hide: _hide
        };
    })();
})();