// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef, prefer-promise-reject-errors */

// ==UserScript==
// @name           ViewOnYP
// @namespace      https://github.com/TheLastZombie/
// @version        2.1.0
// @description    Links various membership platforms to Kemono.
// @description:de Vernetzt verschiedene Mitgliedschaftsplattformen mit Kemono.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=ViewOnYP
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/ViewOnYP.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/ViewOnYP.meta.js
// @author         TheLastZombie
// @match          *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @match          *://*.fanbox.cc/
// @match          *://gumroad.com/*
// @match          *://www.patreon.com/*
// @match          *://www.subscribestar.com/*
// @match          *://subscribestar.adult/*
// @connect        kemono.party
// @connect        api.fanbox.cc
// @grant          GM.getValue
// @grant          GM_getValue
// @grant          GM.setValue
// @grant          GM_setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ViewOnYP.ico
// @license        MIT
// ==/UserScript==

(async function () {
  if (!await GM.getValue('cache')) await GM.setValue('cache', {})
  const cache = await GM.getValue('cache')

  document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
    <style>
      #voyp {
        background: white;
        position: fixed;
        top: calc(100vh - 25px);
        left: 50%;
        transform: translateX(-50%);
        border-radius: 5px 5px 0 0;
        padding: 25px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
        text-align: center;
        z-index: 9999;
      }
      #voyp:hover {
        top: initial;
        bottom: 0;
      }
      #voyp div {
        font-size: small;
        text-transform: uppercase;
        margin-bottom: 12.5px;
        opacity: 0.5;
        text-align: center;
      }
    </style>
  `)

  const host = window.location.hostname.split('.').slice(-2, -1)[0]
  if (!host) return

  const p = new Promise((resolve, reject) => {
    switch (host) {
      case 'dlsite':
        resolve(document.location.pathname.split('/')[6].slice(0, -5))
        break
      case 'fanbox':
        GM.xmlHttpRequest({
          url: 'https://api.fanbox.cc/creator.get?creatorId=' + window.location.hostname.split('.').slice(-3, -2)[0],
          headers: { Origin: 'https://fanbox.cc' },
          onload: response => resolve(JSON.parse(response.responseText).body.user.userId)
        })
        break
      case 'gumroad':
        resolve(document.querySelector('.creator-profile-wrapper').getAttribute('data-username'))
        break
      case 'patreon':
        resolve(document.querySelector('script:not([src]):not(.darkreader)').innerHTML.match(/https:\/\/www\.patreon\.com\/api\/user\/\d+/)[0].slice(33))
        break
      case 'subscribestar':
        resolve(document.location.pathname.split('/')[1])
        break
    }
  })

  p.then(user => {
    const url = 'https://kemono.party/' + host + '/user/' + user

    if (cache[host] && cache[host].includes(user)) return document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="voyp"><div>ViewOnYP</div>Kemono: <a href="' + url + '">' + url + '</a></div>')

    GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      onload: response => {
        if (!response.responseText.includes('<h1 class="subtitle">Nobody here but us chickens!</h1>')) {
          document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="voyp"><div>ViewOnYP</div>Kemono: <a href="' + url + '">' + url + '</a></div>')

          if (!cache[host]) cache[host] = []
          if (!cache[host].includes(user)) cache[host].push(user)
          GM.setValue('cache', cache)
        }
      }
    })
  })
})()

// @license-end
