// ==UserScript==
// @name           Collapsit
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.0
// @description    Enables collapsing (and expanding) of comments on Removeddit.
// @description:de Ermöglicht das Ein- und Ausklappen von Kommentaren auf Removeddit.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/Collapsit.user.js
// @author         TheLastZombie
// @match          *://*.removeddit.com/r/*/comments/*
// @grant          none
// @require        https://code.jquery.com/jquery-3.5.1.js
// @icon           https://www.removeddit.com/images/favicon.ico
// ==/UserScript==

$(function() {

    $(document).on("click", ".comment-head .author:not(.comment-author)", function(event){
        if ($(this).text() == "[–]") {
            $(this).parentsUntil(".comment").siblings("div:not(.comment-head)").hide();
            $(this).text("[+]");
        } else {
            $(this).parentsUntil(".comment").siblings("div:not(.comment-head)").show();
            $(this).text("[–]");
        };
    });

});
