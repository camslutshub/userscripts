// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           Collapsit
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.2
// @description    Enables collapsing (and expanding) of comments on Removeddit.
// @description:de Ermöglicht das Ein- und Ausklappen von Kommentaren auf Removeddit.
// @homepageURL    https://github.com/TheLastZombie/userscripts#collapsit-
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=Collapsit
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/Collapsit.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/Collapsit.meta.js
// @author         TheLastZombie
// @match          *://*.removeddit.com/r/*/comments/*
// @grant          none
// @require        https://code.jquery.com/jquery-3.5.1.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/Collapsit.ico
// @copyright      2020-2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license        MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author         TheLastZombie
// ==/OpenUserJS==

$(function () {
  $(document).on('click', '.comment-head .author:not(.comment-author)', function (event) {
    if ($(this).text() === '[–]') {
      $(this).parentsUntil('.comment').siblings('div:not(.comment-head)').hide()
      $(this).text('[+]')
    } else {
      $(this).parentsUntil('.comment').siblings('div:not(.comment-head)').show()
      $(this).text('[–]')
    }
  })
})

// @license-end
