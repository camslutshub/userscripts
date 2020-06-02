// ==UserScript==
// @name           BandcampTrackCover
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.3
// @description    Forces showing track instead of album covers on Bandcamp.
// @description:de Ersetzt gegebenenfalls Album- mit Trackcovern auf Bandcamp.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/BandcampTrackCover.user.js
// @author         TheLastZombie
// @match          https://*.bandcamp.com/*
// @grant          none
// @icon           https://s4.bcbits.com/img/favicon/favicon-32x32.png
// ==/UserScript==

$(function () {

    $("body").on("DOMSubtreeModified", ".play_cell", function() {
        $.ajax({
            url: $(".title_link.primaryText").attr("href"),
            success: function (result) {

                $("#tralbumArt a").attr("href", $(result).find("#tralbumArt a").attr("href"));
                $("#tralbumArt a img").attr("src", $(result).find("#tralbumArt a img").attr("src"));

            }
        });
    });

});
