// ==UserScript==
// @name         ViewOnYP
// @namespace    https://github.com/TheLastZombie/
// @version      1.0.0
// @description  Adds a YP button to the social links of Patreon artists.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/ViewOnYP.user.js
// @author       TheLastZombie
// @match        https://www.patreon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.js
// ==/UserScript==

$(function () {
    $.getJSON("https://yiff.party/json/creators.json", function (result) {
        result = result.creators.filter(x => x.name == window.location.pathname.slice(1))[0];
        if (result) {
            $(".sc-iwsKbI.exHrkV").append("<div class='sc-iwsKbI kxAqoU'><span class='sc-1etnsv3-0 iaQWjD'><a class='sc-eNQAEJ kIbEzP' href='https://yiff.party/patreon/" + result.id + "' target='_blank'><div class='sc-dxgOiQ hhhktq'><div class='sc-VigVT fAweOF'><span class='sc-gqjmRU hcoOws'>YP</span></div></div></a></span></div>");
        };
    });
});
