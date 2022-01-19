// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            BandcampTrackCover
// @name:de         BandcampTrackCover
// @name:en         BandcampTrackCover
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.8
// @description     Forces showing track instead of album covers on Bandcamp.
// @description:de  Ersetzt gegebenenfalls Album- mit Trackcovern auf Bandcamp.
// @description:en  Forces showing track instead of album covers on Bandcamp.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=BandcampTrackCover
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/BandcampTrackCover.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/BandcampTrackCover.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           https://*.bandcamp.com/*
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/BandcampTrackCover.png
// @copyright       2019-2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  const observer = new MutationObserver(() => {
    GM.xmlHttpRequest({
      url: document.querySelector('.title_link.primaryText').getAttribute('href'),
      onload: response => {
        const result = document.createElement('html')
        result.innerHTML = response.responseText

        document.querySelector('#tralbumArt a').setAttribute('href', result.querySelector('#tralbumArt a').getAttribute('href'))
        document.querySelector('#tralbumArt a img').setAttribute('src', result.querySelector('#tralbumArt a img').getAttribute('src'))
      }
    })
  })

  observer.observe(document.getElementsByClassName('play_cell')[0], {
    attributes: true,
    childList: true,
    subtree: true
  })
})()

// @license-end
