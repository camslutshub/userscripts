// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           BandcampTrackCover
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.4
// @description    Forces showing track instead of album covers on Bandcamp.
// @description:de Ersetzt gegebenenfalls Album- mit Trackcovern auf Bandcamp.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=BandcampTrackCover
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/BandcampTrackCover.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/BandcampTrackCover.meta.js
// @author         TheLastZombie
// @match          https://*.bandcamp.com/*
// @grant          none
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/BandcampTrackCover.png
// @license        MIT
// ==/UserScript==

$(function () {
  $('body').on('DOMSubtreeModified', '.play_cell', function () {
    $.ajax({
      url: $('.title_link.primaryText').attr('href'),
      success: function (result) {
        $('#tralbumArt a').attr('href', $(result).find('#tralbumArt a').attr('href'))
        $('#tralbumArt a img').attr('src', $(result).find('#tralbumArt a img').attr('src'))
      }
    })
  })
})

// @license-end
