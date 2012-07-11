define(['librarian/base'], function () {
    TEGUD.Librarian.Grid = function (gridElement) {
        var renderData = function (data) {
            gridElement.html($.map(data, function (item) {
                return '<li'
                        + ' data-stuff-item-id="' + item.Id + '"'
                        + (item.LentTo ? ' data-stuff-item-lent-to="' + item.LentTo + '"' : '')
                        + ' data-stuff-item-category="' + item.StuffCategory.Name + '"' + '>'
                        + '<div class="item-category-icon stuff-category-type ' + item.StuffCategory.UniqueSafeName + '" title="' + item.StuffCategory.Name + '"></div>'
                        + '<div class="item-status-icon stuff-status' + (item.LentTo ? ' lent-out' : '') + '" title="' + (item.LentTo ? item.LentTo : 'At Home') + '">' + (item.LentTo || 'At Home') + '</div>'
                        + '<span class="item-name">' + item.Name + '</span>'
                        + '</li>';
            }).join(''));
        };

        gridElement.on('click', 'li', function() {
            require(['librarian/update'], function () {
                TEGUD.Librarian.OpenUpdateItemDialog($(this));
            });
        });

        return {
            render: renderData
        };
    };
});