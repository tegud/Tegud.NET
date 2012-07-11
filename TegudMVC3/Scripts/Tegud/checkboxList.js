define(['tegud/base'], function () {
    var defaultEnabledClass = 'enabled';

    TEGUD.CheckboxList = function (ulElement, options) {
        var enabledSelector,
            notEnabledSelector,
            enabledClass = (options || {}).enabledClass,
            getItemValue = function (item) {
                return $(item).data('value') || item.className.replace(' enabled', '');
            };

        if (typeof enabledClass === 'undefined') {
            enabledClass = defaultEnabledClass;
        }

        enabledSelector = '.' + enabledClass; ;
        notEnabledSelector = ':not(' + enabledSelector + ')';

        ulElement.on('click', 'li', function () {
            var selectedItem = $(this);
            selectedItem.toggleClass(enabledClass);

            if (options && options.singleSelect) {
                selectedItem.siblings().removeClass(enabledClass);
            }
        });

        return {
            areAllSelected: function () {
                return ulElement.children(notEnabledSelector).length ? false : true;
            },
            areAllUnselected: function () {
                return ulElement.children(enabledSelector).length ? false : true;
            },
            selectAll: function () {
                return ulElement.children().addClass(enabledClass);
            },
            unselectAll: function () {
                return ulElement.children().removeClass(enabledClass);
            },
            getSelectedValues: function () {
                return $.map(ulElement.children(enabledSelector), function (item) {
                    return getItemValue(item);
                }).join(',');
            },
            getSelectedIds: function () {
                return $.map(ulElement.children(enabledSelector), function (item) {
                    return $(item).data('id') || getItemValue(item);
                });
            }
        };
    };
});