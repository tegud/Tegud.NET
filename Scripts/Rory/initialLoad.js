define(['tegud/base', 'utilities/pubsub', 'tegud/spinner', 'flickr/yearMonthGroupedPhotoStore', 'PhotoGrid/base'], function () {
    var loadingDialogSetupDeferred = $.Deferred();

    TEGUD.debugEnabled = true;

    $.when(TEGUD.pageLoadDeferred)
        .then(function () {
            var loadingDialog = $('#InitialLoadingMessage'),
                spinner = new TEGUD.Spinner($('.spinner', loadingDialog), {
                    sequence: [0, 1, 2, 5, 8, 7, 6, 3]
                }),
                centerLoadingDialog = function () {
                    loadingDialog
                        .css({
                            top: ($(document).height() - 200) / 2,
                            left: ($(document).width() - 270) / 2
                        });
                };

            centerLoadingDialog();
            loadingDialog.removeClass('hidden');

            new TEGUD.Flickr.yearMonthGroupedPhotoStore();
            new TEGUD.PhotoGrid($('#PhotoGrid'));

            TEGUD.Utilities.subscribe('TEGUD.Flickr.PhotosLoadFailed', function (m, errorMessage) {
                console.log('Attempt to load Flickr API photos failed: ' + errorMessage);
            });

            TEGUD.Utilities.subscribe('TEGUD.Flickr.GridRenderComplete', function () {
                loadingDialog.fadeOut(500, function () {
                    loadingDialog.remove();
                    loadingDialog = undefined;
                });
            });

            loadingDialogSetupDeferred.resolve();
        });
});