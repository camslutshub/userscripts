// ==UserScript==
// @name         BandcampTrackCover
// @namespace    https://github.com/TheLastZombie/
// @version      1.0.1
// @description  Forces showing track instead of album covers on Bandcamp.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/BandcampTrackCover.user.js
// @author       TheLastZombie
// @match        https://*.bandcamp.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

$(function () {

    $("body").on("DOMSubtreeModified", ".title_link.primaryText", function() {
        $.ajax({
            url: $(".title_link.primaryText").attr("href"),
            success: function (result) {

                $("#tralbumArt a").attr("href", $(result).find("#tralbumArt a").attr("href"));
                $("#tralbumArt a img").attr("src", $(result).find("#tralbumArt a img").attr("src"));

            }
        });
    });

});
