/// <reference path="../jQuery/jquery.1.6.2-dev.js"/>
/// <reference path="../Tegud/base.js"/>
/// <reference path="../Tegud/ajax.js"/>
/// <reference path="../Tegud/overlay.js"/>
/// <reference path="../Utilities/base.js"/>
/// <reference path="../Utilities/yql.js"/>

(function () {
    var stuff = TEGUD.registerNameSpace('TEGUD.Stuff'),
        _nameCategories = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        _stuffItemContainer,
        _categoryFilters,
        _nameFilter,
        _statusFilters,
        _lentToFilter,
        _itemIsLentOut = function (item) {
            return item.hasClass('lentTo') && item.closest('ul').hasClass('CategoryFilter');
        },
        _filterDebounce,
        _setCategoryAndStatusFilterCounts = function () {
            var toggleAllCategories = $('#CategoryFilterContainer').children('.ToggleAll');

            _categoryFilters.add(_statusFilters).children().each(function () {
                var item = $(this),
                    className = this.className,
                    count = $('.count > em', item),
                    itemCount = $('li', _stuffItemContainer).filter('.' + className + ':visible').size();

                count.text(itemCount + ' item' + (itemCount !== 1 ? 's' : ''));
            });

            toggleAllCategories[(_categoryFilters.children(':has(.checkbox:not(.on))').length ? 'add' : 'remove') + 'Class']('SelectAll');

            _stuffItemContainer.children('ul').each(function () {
                var ul = $(this);

                ul.prev()[((ul.children(':visible').length) ? 'remove' : 'add') + 'Class']('hiddenElement');
            });
        },
        _filterStuffItemsByCurrentSettings = function () {
            var nameFilter = _nameFilter.val().toLowerCase(),
                lentToFilter = _lentToFilter.prop('disabled') ? '' : _lentToFilter.val().toLowerCase(),
                itemsToDisplay = $([]),
                allItems = $('li', _stuffItemContainer).removeClass('Display'),
                statusFilter = $.map(_statusFilters.children(), function (item) {
                    if (!$(item).children('.checkbox').hasClass('on')) {
                        return ':not(.' + item.className + ')';
                    }
                }).join('');

            _categoryFilters.children().each(function () {
                var add = false,
                    item = $(this);

                if (item.children('.checkbox').hasClass('on')) {
                    add = true;
                }

                if (add) {
                    itemsToDisplay = itemsToDisplay.add(allItems.filter('.' + this.className));
                }
            });

            if (statusFilter) {
                itemsToDisplay = itemsToDisplay.filter(statusFilter);
            }

            itemsToDisplay.addClass('Display');

            if (nameFilter || lentToFilter) {
                itemsToDisplay.filter('.Display').each(function () {
                    var item = $(this);

                    if ((nameFilter && item.text().toLowerCase().indexOf(nameFilter) < 0)
                        || (lentToFilter && (!item.data('tegudLentTo') || item.data('tegudLentTo').toLowerCase().indexOf(lentToFilter) < 0))) {
                        item.removeClass('Display');
                    }
                });
            }

            allItems
                .filter('.Display').show()
                .end()
                .filter(':not(.Display)').hide();

            _setCategoryAndStatusFilterCounts();
        },
        _filterItems = function () {
            if (_filterDebounce) {
                return;
            }

            _filterStuffItemsByCurrentSettings();

            _filterDebounce = setTimeout(function () {
                _filterDebounce = false;
            }, 250);
        };

    TEGUD.registerInit(function () {
        _stuffItemContainer = $('#StuffContainer');
        _categoryFilters = $('#CategoryFilters');
        _statusFilters = $('#StatusFilters');
        _nameFilter = $('#FilterName');
        _lentToFilter = $('#FilterByLentTo');

        _nameFilter.add(_lentToFilter).bind('keyup', function () {
            _filterItems();
        });

        _stuffItemContainer.delegate('.StuffNameHeader', 'click', function () {
            var alphabetDialog;

            TEGUD.overlay.show({
                onShow: function () {
                    alphabetDialog = $('<ul id="AlphabetDialog">' + $.map(_nameCategories, function (letter) {
                        return '<li>' + letter + '</li>';
                    }) + '</ul>').appendTo('body');


                },
                onHide: function () {



                }
            });
        });

        $('#CategoryFilterContainer').delegate('.ToggleAll', 'click', function () {
            var button = $(this),
                classMethod = button.hasClass('SelectAll') ? 'add' : 'remove';

            _categoryFilters.children().children('.checkbox')[classMethod + 'Class']('on');
            button.toggleClass('SelectAll');

            _filterItems();
        });

        $('#SideBar')
            .delegate('.CategoryFilter > li', 'click', function () {
                var item = $(this),
                    checkbox = item.children('.checkbox');

                checkbox.toggleClass('on');

                if (_itemIsLentOut(item)) {
                    _lentToFilter.prop('disabled', !checkbox.hasClass('on'));
                }

                _filterItems();
            });

        $('#FilterByLentToContainer')
            .add($('#NameFilterFieldContainer'))
            .delegate('.ResetFilter', 'click', function () {
                $(this).prev().val('');
                _filterItems();
            });

    });
})();