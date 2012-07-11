(function () {
    var tiles = TEGUD.registerNameSpace('TEGUD.Tiles');

    tiles.Modules = {};

    TEGUD.registerInit(function (tileContainer) {
        var siteControls,
            selectedTileSetButton,
            expandTile = function () {
                var tile = $(this),
                            tileTimeout = tile.data('mouseUpTimeout');

                // Not a tile, exit.
                if (tile.is(':animated')) {
                    return;
                }

                if (tileTimeout) {
                    clearTimeout(tileTimeout);
                    tile.removeData('mouseUpTimeout');
                }

                tile.addClass('Active');
            },
            shrinkTile = function (triggerSelect) {
                var tile = $(this),
                    tileTimeout = tile.data('mouseUpTimeout');

                // Not a tile, exit, or an timeout is already active.
                if (tile.is(':animated') || tileTimeout) {
                    return;
                }

                tile.data('mouseUpTimeout', setTimeout(function () {
                    tile
                        .removeClass('Active')
                        .removeData('mouseUpTimeout');

                    if (triggerSelect === true) {
                        tile.trigger('tileSelect');
                    }
                }, 250));
            },
            tileCols = [],
            tileColLength,
            x,
            loadTile = function (x) {
                tileCols[x].addClass('Loaded');
            },
            gotoTileSet = function (item, animate) {
                var index = item.index();

                tileContainer[animate ? 'animate' : 'css']({
                    left: -tileContainer.children(':first').outerWidth() * (index)
                }, 500);

                if (animate) {
                    item
                    .animate({
                        opacity: 0
                    },
                    500,
                    function () {
                        item.addClass('hiddenElement');
                    })
                    .siblings(':hidden')
                        .css('opacity', 0)
                            .removeClass('hiddenElement')
                                .animate({
                                    opacity: 1
                                },
                                500);
                    siteControls
                    .css('bottom', (index * item.height()) - 10)
                    .animate({
                        bottom: 10 - (index * item.height())
                    },
                        500,
                        function () {
                            siteControls.css('bottom', 10);
                        });
                }
                else {
                    item
                        .css({
                            opacity: 0
                        })
                        .addClass('hiddenElement')
                            .siblings(':hidden')
                            .css('opacity', 0)
                                .removeClass('hiddenElement')
                                    .animate({
                                        opacity: 1
                                    },
                                    500);

                    siteControls.css('bottom', 10);
                }
            };

        siteControls = $('#SiteControls').delegate('li', 'click', function () {
            gotoTileSet($(this), true);
        });

        selectedTileSetButton = siteControls.children('[data-tegud-fragment=\'' + TEGUD.Utilities.Url.getFragment(window.location.href) + '\']');

        if (selectedTileSetButton.length) {
            gotoTileSet(selectedTileSetButton);
        }

        tileContainer
            .delegate('.Tile', 'tileSelect', function () {
                // Toggle Page Switch
                var target = $(this).data('tegudTileTarget');

                if (!target) {
                    return;
                }

                window.location = target;
            })
            .delegate(':not(.NoClickAction).Tile', 'mousedown', expandTile)
            .delegate('.Tile', 'mouseout', shrinkTile)
            .delegate('.Tile', 'mouseup', function () {
                shrinkTile.call(this, true);
            })
            .children('.TileSet')
                .children('.TileSetTiles')
                    .children('.Tile')
                        .each(function () {
                            var tile = $(this),
                                leftPosition = Math.abs(tile.position().left - 272),
                                col = Math.floor(leftPosition / 270),
                                module = tile.data('tegudTileModule');

                            // Check if the module has an initilisation 
                            if (module && tiles.Modules[module] && tiles.Modules[module].init && $.isFunction(tiles.Modules[module].init)) {
                                tiles.Modules[module].init(tile);
                            }

                            tileCols[col] = !tileCols[col] ? $(this) : tileCols[col].add($(this));
                        });

        tileColLength = tileCols.length;

        for (x = 0; x < tileCols.length; x++) {
            if (!x) {
                loadTile(x);
            } else {
                (function (x) {
                    setTimeout(function () {
                        loadTile(x);
                    }, (x * 100));
                })(x);
            }
        }
    }, 'Tiles');
})();