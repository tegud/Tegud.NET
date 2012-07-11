define(['utilities/base', 'utilities/pubsub', 'tegud/dialog'], function () {
    var addNewDialog,
        utilities = TEGUD.Utilities,
        publish = utilities.publish,
        subscribe = utilities.subscribe;

    TEGUD.Librarian.OpenAddNewItemDialog = function (categoriesUl) {
        console.log('Opening add new item dialog');
        var dialogContent,
            dialogCategoryList,
            dialogCategoryListUl,
            selectedCategories,
            closeDialog,
            newNameField,
            addNewItem,
            clearForm,
            dialogMessage,
            itemsAdded = 0,
            addInProgress,
            sizeDialogMessage = function () {
                dialogMessage[dialogMessage.height() > 20 ? 'addClass' : 'removeClass']('dialog-message-two-lines');
            },
            setDialogErrorMessage = function (message) {
                dialogMessage
                    .text(message)
                    .addClass('dialog-error-message');
                sizeDialogMessage();
            },
            setDialogInformationMessage = function (message) {
                dialogMessage
                    .text(message)
                    .removeClass('dialog-error-message');
                sizeDialogMessage();
            };

        if (addNewDialog) {
            return;
        }

        dialogContent = $('<div class="dialog-add-item"></div>')
                            .append("<h3>Name</h3>")
                            .append(newNameField = $("<input type=\"text\" class=\"stuff-name-field\" />"))
                            .append("<h3>Category</h3>");

        dialogCategoryListUl = $('<ul class="RadioList category-list">' + categoriesUl.html() + '</ul>')
                            .appendTo(dialogContent);

        dialogMessage = $('<div class="dialog-item-added-message"></div>').appendTo(dialogContent);

        selectedCategories = dialogCategoryListUl.children('.enabled');
        if (selectedCategories.size() > 1) {
            selectedCategories.removeClass('enabled');
        }

        dialogCategoryList = new TEGUD.CheckboxList(dialogCategoryListUl, {
            singleSelect: true
        });

        closeDialog = function () {
            addNewDialog.close();
            addNewDialog = undefined;

            if (itemsAdded) {
                publish('Tegud.Librarian.ParametersUpdated');
            }
        };

        newNameField.on('keydown', function (e) {
            if (e.keyCode !== 13) {
                return;
            }

            if (!newNameField.val()) {
                closeDialog();
            }

            addNewItem();
        });

        clearForm = function () {
            newNameField
                .val('')
                .trigger('focus');
        };

        addNewItem = function () {
            if (addInProgress) {
                console.log('Item already being added.');
                setDialogErrorMessage('Already adding item');
                return;
            }

            var newItem = {
                name: newNameField.val(),
                category: dialogCategoryList.getSelectedIds()[0]
            };

            if (!newItem.name || !newItem.category) {
                setDialogErrorMessage(!newItem.name ? 'Enter name' : 'Select category');
                return;
            }

            addInProgress = true;

            console.log('Attempting to add item: ' + JSON.stringify(newItem));
            setDialogInformationMessage('Adding...');

            publish('Tegud.Librarian.AddItem', newItem);
        };

        subscribe('Tegud.Librarian.ItemAdded', function () {
            if (!addNewDialog) {
                return;
            }
            console.log('Item added...');
            addInProgress = false;
            itemsAdded++;

            setDialogInformationMessage(itemsAdded + ' item' + (itemsAdded > 1 ? 's' : '') + ' added');
            dialogContent.parents('.dialog-content').find('.button-icon-cancel').text('Done');

            clearForm();
        });

        addNewDialog = new TEGUD.Dialog(dialogContent, {
            width: 300,
            height: 380,
            title: 'Add New Item',
            titleIcon: 'icon-item add-new-item',
            buttons: [
                {
                    text: 'Cancel',
                    iconClass: 'icon-item button-icon-cancel',
                    action: function () {
                        if (addInProgress) {
                            console.log('Item add in progress.');
                            setDialogErrorMessage('Adding item');
                            return;
                        }

                        closeDialog();
                    }
                },
                {
                    text: 'Add',
                    iconClass: 'icon-item add-new-item',
                    action: addNewItem
                }]
        });
    };
});
