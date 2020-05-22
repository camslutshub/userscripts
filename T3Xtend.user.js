// ==UserScript==
// @name         T3Xtend
// @namespace    https://github.com/TheLastZombie/
// @version      1.0.0
// @description  Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/T3Xtend.user.js
// @author       TheLastZombie
// @match        https://extensions.typo3.org/extension/*
// @grant        none
// ==/UserScript==

(function() {

    // Shorten button text

    $(".ter-ext-single-versionhistory tr:has(.btn) td:last-child a").each(function () {
        $(this).text($(this).text().replace("Download", "").replace("Archive", ""));
    });

    // Add buttons to old versions

    $(".ter-ext-single-versionhistory tr:not(:has(.btn)) td:first-child strong").each(function () {
        $(this)
            .parent()
            .parent()
            .find("td:last-child")
            .append("<a class='btn btn-primary' href='/extension/download/"
                    + location.pathname.split("/")[2]
                    + "/"
                    + $(this).text()
                    + "/zip/'>ZIP</a>");
    });

    // Add T3X download buttons

    $(".ter-ext-single-versionhistory tr td:last-child a").each(function () {
        var button = $(this)
            .clone()
            .attr("href", $(this).attr("href").replace("/zip/", "/t3x/"))
            .text("T3X");
        $(this).after(button);
    });

    // Improve button styles

    $(".ter-ext-single-versionhistory tr td:last-child a").each(function () {
        $(this).css({
            "padding-left": "1rem",
            "padding-right": "1rem"
        });
        $(this).parent().css({
            "display": "flex",
            "justify-content": "space-around"
        });
    });

})();
