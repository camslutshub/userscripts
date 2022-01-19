// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            MSGPIntegration
// @name:de         MSGPIntegration
// @name:en         MSGPIntegration
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.1
// @description     Allows access to the Microsoft Store Generation Project from within Microsoft Store itself.
// @description:de  Integriert das Microsoft Store Generation Project in den Microsoft Store selbst.
// @description:en  Allows access to the Microsoft Store Generation Project from within Microsoft Store itself.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=MSGPIntegration
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/MSGPIntegration.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/MSGPIntegration.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           https://www.microsoft.com/*/p/*/*
// @connect         store.rg-adguard.net
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/MSGPIntegration.ico
// @copyright       2021-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  document.getElementById('buttonPanel').insertAdjacentHTML('afterend', "<div id='msgpintegration-wrapper' class='pi-button-panel'><div class='pi-overflow-ctrl'><button id='msgpintegration-button' class='c-button' disabled><span id='msgpintegration-text'>Loading...</span></button></div></div>")

  const lang = location.pathname.split('/')[1]
  const url = location.pathname.split('/')[4]

  GM.xmlHttpRequest({
    method: 'POST',
    url: 'https://store.rg-adguard.net/api/GetFiles',
    data: 'type=ProductId&url=' + url + '&lang=' + lang,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    onload: function (response) {
      const element = document.createElement('html')
      element.innerHTML = response.responseText

      if (element.getElementsByTagName('p')[0].innerText !== 'The links were successfully received from the Microsoft Store server.') {
        document.getElementById('msgpintegration-text').innerText = 'No links found.'
        return
      }

      document.getElementById('msgpintegration-button').removeAttribute('disabled')
      document.getElementById('msgpintegration-text').innerText = element.getElementsByClassName('tftable')[0].rows.length - 1 + ' links found.'

      document.body.insertAdjacentHTML('beforeend', "<div id='msgpintegration-background'></div>")
      document.getElementById('msgpintegration-background').insertAdjacentElement('beforeend', element.getElementsByClassName('tftable')[0])
      document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
        <style>
          #msgpintegration-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999;
            background-color: rgba(24, 26, 27, 0.9);
            padding: 5em;
            overflow-y: auto;
            display: none;
          }
          .tftable {
            background-color: white;
          }
        </style>
      `)

      document.getElementById('msgpintegration-button').addEventListener('click', function () {
        document.getElementById('msgpintegration-background').style.display = 'initial'
      })

      document.getElementById('msgpintegration-background').addEventListener('click', function (e) {
        if (e.target === document.getElementById('msgpintegration-background')) document.getElementById('msgpintegration-background').style.display = 'none'
      })
    }
  })
})()

// @license-end
