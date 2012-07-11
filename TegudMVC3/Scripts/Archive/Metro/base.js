(function () {
    TEGUD.Metro = {
        ContentManager: function (contentContainer, contentElement) {
            var _contentContainer = contentContainer,
                _contentElement = contentElement,
                _slideOut = function (item, callback) {
                    item
                        .animate({
                            left: _contentContainer.outerWidth() + 30
                        },
                        500)
                        .queue(callback);
                },
                _slideIn = function (item, callback) {
                    item
                        .animate({
                            left: (_contentContainer.outerWidth() - item.outerWidth()) / 2
                        },
                        500)
                        .queue(callback);
                },
                _switchContent = function (item, content) {
                    _slideOut(item, function () {
                        item.html(content);
                        _slideIn(item);
                    });
                },
                _switchElements = function (itemToHide, itemToShow, callback) {
                    itemToHide.add(itemToShow).stop();

                    _slideOut(itemToHide, function () {
                        if (itemToShow && !$.isFunction(itemToShow)) {
                            _slideIn(itemToShow, callback);
                        }
                    });
                },
                _loadingDiv,
                _appendLoadingDivIfNotPresent = function () {
                    if (!_loadingDiv) {
                        _loadingDiv = $('<article class="Loading"><div class="Spinner"></div><div class="Text cufon">Logging In</div></article>').appendTo(_contentContainer);
                        _loadingDiv.css({
                            left: _contentContainer.outerWidth(),
                            top: (_contentContainer.outerHeight() - _loadingDiv.outerHeight()) / 2
                        });
                    }
                };

            return {
                switchContent: _switchContent,
                switchElements: _switchElements,
                getLoadingElement: function () {
                    _appendLoadingDivIfNotPresent();

                    return _loadingDiv;
                },
                showLoading: function () {
                    _appendLoadingDivIfNotPresent();

                    _switchElements(_contentElement, _loadingDiv);

                    // Return the hide loading callback.
                    return (function (newElement) {
                        var nextElement = newElement || _contentElement;
                        _loadingDiv.stop().clearQueue();
                        _contentElement.clearQueue();

                        // Stop any existing items.
                        _switchElements(_loadingDiv, nextElement);
                    });
                }
            };
        },
        Header: function (ul) {
            var defaultLeft = ul.position().left;

            ul
                .delegate('li:not(.Current)', 'click', function () {
                    if (ul.is(':animated')) {
                        return;
                    }

                    var item = $(this).addClass('Current'),
                        previousItem = item.siblings('.Current').removeClass('Current'),
                        newItems = $.makeArray(item.prevAll().clone()),
                        originalWidth = ul.outerWidth(),
                        additionalWidth = 0;

                    item.prevAll().each(function () {
                        additionalWidth += $(this).outerWidth();
                    });

                    // Append the cloned items in reverse to the end of the ul.
                    $(newItems.reverse()).appendTo(ul.css('width', originalWidth + additionalWidth));

                    // Redo the Cufon text on the new items.
                    if (!$.browser.msie || $.browser.version > 8) {
                        Cufon.replace(newItems);
                    }

                    // Trigger the selectItem event.
                    item.trigger('selectItem', previousItem);

                    ul
                        .animate({
                            left: -item.position().left + defaultLeft
                        },
                            500,
                            function () {
                                item.prevAll().remove();

                                ul.css({
                                    width: originalWidth,
                                    left: defaultLeft
                                });
                            });
                });


            return {
                moveToNext: function () {
                    ul.children('.Current').next().trigger('click');
                },
                moveToPrevious: function () {
                    var previousItem = ul.children(':last');
                    // When moving backwards, we need to get the last item, prepend it to the ul, and the ul
                    // so it appears in the same position.
                    previousItem
                        .prependTo(ul.css('left', -previousItem.outerWidth() - defaultLeft))
                        .trigger('click');
                }
            };
        }
    };
})();