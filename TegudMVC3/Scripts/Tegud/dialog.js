(function ($) {
    define(['tegud/base'], function () {
        var mask,
            defaultOptions = {
                width: 300,
                height: 400
            },
            $window,
            displayMask = function () {
                $window = $(window);
                mask = $('<div class="dialog-mask"></div>')
                    .css({
                        width: $window.width(),
                        height: $window.height()
                    })
                    .appendTo($('body'));
            },
            removeMask = function () {
                mask.remove();
                mask = undefined;
            },
            sizeDialogElements = function (dialog, width, height) {
                var titleDiv = dialog.children('.dialog-title'),
                    contentDiv = dialog.children('.dialog-inner-content'),
                    buttonsDiv = dialog.children('.dialog-buttons'),
                    titleDivHeight = titleDiv.length ? titleDiv.height() : 0,
                    buttonsDivHeight = buttonsDiv.length ? buttonsDiv.height() : 0;

                contentDiv
                    .css({
                        height: height - titleDivHeight - buttonsDivHeight - 35
                    });

                dialog
                    .css({
                        width: width,
                        height: height,
                        top: ($window.height() - height) / 2,
                        left: ($window.width() - width) / 2
                    });
            },
            appendContentDiv = function (content) {
                var contentWrapper;

                if (typeof content === 'string') {
                    return $('<div class="dialog-content"><div class="dialog-inner-content">' + content + '</div></div>').appendTo($('body'));
                }

                contentWrapper = $('<div class="dialog-content"></div>');

                $('<div class="dialog-inner-content"></div>')
                    .append(content)
                    .appendTo(contentWrapper.appendTo('body'));

                return contentWrapper;
            },
            setDialogTitle = function (dialog, title, titleIcon) {
                if (!title && !titleIcon) {
                    return;
                }

                dialog
                    .prepend('<div class="dialog-title' + (titleIcon ? ' with-icon ' + titleIcon : '') + '">' + title + '</div>');
            },
            setDialogButtons = function (dialog, buttons) {
                var buttonList;

                if (!buttons) {
                    return;
                }

                buttonList = $('<ul class="dialog-buttons RadioList"></ul>');

                $.each(buttons, function (i, item) {
                    var button = $('<li' + (item.iconClass ? ' class="' + item.iconClass + '"' : '') + '>' + item.text + '</li>');

                    if (item.action && $.isFunction(item.action)) {
                        button.on('click', function () {
                            item.action();
                        });
                    }

                    buttonList.append(button);
                });

                buttonList.appendTo(dialog);
            };

        TEGUD.Dialog = function (content, options) {
            var dialog;

            options = $.extend(defaultOptions, options);

            if (!mask) {
                displayMask();
            }

            dialog = appendContentDiv(content);

            setDialogTitle(dialog, options.title, options.titleIcon);
            setDialogButtons(dialog, options.buttons);

            sizeDialogElements(dialog, options.width, options.height);

            return {
                close: function () {
                    dialog.remove();
                    removeMask();
                }
            };
        };
    });
})(jQuery);