// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           T3Xtend
// @namespace      https://github.com/TheLastZombie/
// @version        1.1.3
// @description    Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @description:de Zeigt sowohl T3X- als auch Download-Links zu alten Versionen von TYPO3-Extensions.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=T3Xtend
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/T3Xtend.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/T3Xtend.meta.js
// @author         TheLastZombie
// @match          https://extensions.typo3.org/extension/*
// @grant          none
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/T3Xtend.ico
// @license        MIT
// ==/UserScript==

(function () {
  // Shorten button text

  $('.ter-ext-single-versionhistory tr:has(.btn) td:last-child a').each(function () {
    $(this).text($(this).text().replace('Download', '').replace('Archive', ''))
  })

  // Add buttons to old versions

  $('.ter-ext-single-versionhistory tr:not(:has(.btn)) td:first-child strong').each(function () {
    $(this)
      .parent()
      .parent()
      .find('td:last-child')
      .append("<a class='btn btn-primary' href='/extension/download/" +
                    window.location.pathname.split('/')[2] +
                    '/' +
                    $(this).text() +
                    "/zip/'>ZIP</a>")
  })

  // Add T3X download buttons

  $('.ter-ext-single-versionhistory tr td:last-child a:first-child').each(function () {
    var button = $(this)
      .clone()
      .attr('href', $(this).attr('href').replace('/zip/', '/t3x/'))
      .attr('title', '')
      .text('T3X')
    $(this).after(button)
  })

  // Add Composer command buttons

  if ($('#install-composer').length) {
    $('.ter-ext-single-versionhistory tr td:last-child a:first-child').each(function () {
      var button = $(this)
        .clone()
        .attr('href', 'javascript:void(0)')
        .attr('onclick', 'copyToClipboard(this)')
        .attr('title', '')
        .html('<svg style="width:18px;height:18px;position:relative;top:-1px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg><span style="display:none">' + $('#install-composer kbd').text() + ':' + $(this).parent().parent().find('td:first-child strong').text() + '</span>')
      $(this).after(button)
    })
  }

  // Improve button styles

  $('.ter-ext-single-versionhistory tr td:last-child a').each(function () {
    $(this).css({
      'padding-left': '1rem',
      'padding-right': '1rem'
    })
    $(this).parent().css({
      display: 'flex',
      'justify-content': 'space-around',
      position: 'relative',
      top: '-1px'
    })
  })
})()

// @license-end