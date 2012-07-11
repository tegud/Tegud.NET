define(['librarian/base', 'tegud/checkboxList'], function () {
    TEGUD.Librarian.Controls = function (controlsContainer, librarianParameters) {
        var categoriesUl = $('.category-list', controlsContainer),
            viewsUl = $('.views-list', controlsContainer),
            nameField = $('.stuff-name-field', controlsContainer),
            selectItemAndDeselectRest = function (item) {
                item
                    .addClass('enabled')
                    .siblings()
                    .removeClass('enabled');
            },
            toggleAll = function (enable) {
                selectItemAndDeselectRest($(this));

                categoriesUl.children()[(enable ? 'addClass' : 'removeClass')]('enabled');
                setParams();
            },
            categoryList = new TEGUD.CheckboxList(categoriesUl),
            viewList = new TEGUD.CheckboxList(viewsUl, {
                singleSelect: true
            }),
            setParams = function () {
                librarianParameters.set(nameField.val(),
                    categoryList.getSelectedValues(),
                    viewList.getSelectedValues());
            };

        $('.category-multi-options', controlsContainer)
            .on('click', '.SelectAll', function () {
                toggleAll.call(this, true);
            })
            .on('click', '.SelectNone', function () {
                toggleAll.call(this, false);
            });

        categoriesUl.add(viewsUl).on('click', 'li', setParams);
        nameField.on('keyup', setParams);

        controlsContainer
            .on('click', '.add-new-item', function () {
                require(['librarian/addNew'], function () {
                    TEGUD.Librarian.OpenAddNewItemDialog(categoriesUl);
                });
            });

        return {};
    };
});