// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           StreetVoiceLoader
// @namespace      https://github.com/TheLastZombie/
// @version        1.1.0
// @description    Enables downloading of tracks (and hopefully soon albums) from StreetVoice.
// @description:de Erlaubt das Herunterladen von Liedern (und hoffentlich bald Alben) von StreetVoice.
// @homepageURL    https://github.com/TheLastZombie/userscripts#streetvoiceloader-
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=StreetVoiceLoader
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/StreetVoiceLoader.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/StreetVoiceLoader.meta.js
// @author         TheLastZombie
// @match          https://streetvoice.com/*/songs/*
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/StreetVoiceLoader.ico
// @copyright      2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license        MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author         TheLastZombie
// ==/OpenUserJS==

(function () {
  const wrapper = document.getElementsByClassName('list-item-buttons')[0]
  const song = window.location.toString().split('/')[5]

  GM.xmlHttpRequest({
    method: 'POST',
    url: 'https://streetvoice.com/api/v3/songs/' + song + '/file/',
    onload: response => {
      const file = JSON.parse(response.response).file

      wrapper.insertAdjacentHTML('afterbegin', '<li class="list-inline-item"><a href="' + file + '" download class="btn btn-circle btn-outline-white btn-lg"><span>⬇</span></a></li>')
    }
  })

  const links = document.querySelectorAll('#item_box_list > li')

  links.forEach(x => {
    const wrapper = x.getElementsByClassName('list-item-buttons')[0]
    const song = x.getElementsByTagName('a')[0].getAttribute('href').split('/')[3]

    GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://streetvoice.com/api/v3/songs/' + song + '/file/',
      onload: response => {
        const file = JSON.parse(response.response).file

        wrapper.style.width = 'max-content'
        wrapper.insertAdjacentHTML('beforeend', '<li class="list-inline-item"><a href="' + file + '" download class="btn btn-circle btn-white"><span>⬇</span></a></li>')
      }
    })
  })
})()

// @license-end
