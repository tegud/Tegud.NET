define(['utilities/base', 'utilities/pubsub', 'tegud/dialog'], function () {
    var addNewDialog,
        utilities = TEGUD.Utilities,
        publish = utilities.publish,
        subscribe = utilities.subscribe,
        updateDialog,
        buildDialog = function (itemName, category, lentTo) {
            return $('<div class="dialog-item-update"></div>');
        },
        closeDialog = function () {
            updateDialog.close();
            updateDialog = undefined;
        };

    TEGUD.Librarian.OpenUpdateItemDialog = function (item) {
        var id,
            itemName,
            category,
            categoryClass,
            lentTo;

        if (updateDialog) {
            return;
        }

        id = item.data('stuffItemId');
        itemName = item.children('.item-name').text();
        categoryClass = item.children('');
        category = item.children('');
        lentTo = item.children('');

        updateDialog = new TEGUD.Dialog(buildDialog(itemName, category, lentTo), {
            width: 300,
            height: 380,
            title: 'Update Item',
            titleIcon: 'icon-item add-new-item',
            buttons: [
                {
                    text: 'Cancel',
                    iconClass: 'icon-item button-icon-cancel',
                    action: function () {
                        closeDialog();
                    }
                },
                {
                    text: 'Update',
                    iconClass: 'icon-item update-item'
                }]
        });
    };
});
