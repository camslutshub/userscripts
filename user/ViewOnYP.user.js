// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef, prefer-promise-reject-errors */

// ==UserScript==
// @name           ViewOnYP
// @namespace      https://github.com/TheLastZombie/
// @version        2.0.0
// @description    Links membership platforms to yiff.party and Kemono.
// @description:de Vernetzt Mitgliedschaftsplattformen mit yiff.party und Kemono.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=ViewOnYP
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/ViewOnYP.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/ViewOnYP.meta.js
// @author         TheLastZombie
// @match          *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @match          *://*.fanbox.cc/
// @match          *://fantia.jp/fanclubs/*
// @match          *://gumroad.com/*
// @match          *://www.patreon.com/*
// @match          *://www.subscribestar.com/*
// @match          *://subscribestar.adult/*
// @connect        yiff.party
// @connect        kemono.party
// @connect        api.fanbox.cc
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ViewOnYP.ico
// @license        MIT
// ==/UserScript==

(function () {
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

  const p0 = new Promise((resolve, reject) => {
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
      case 'fantia':
        resolve(document.querySelector('.fanclub-header a').getAttribute('href').slice(10))
        break
      case 'gumroad':
        resolve(document.querySelector('.creator-profile-wrapper').getAttribute('data-username'))
        break
      case 'patreon':
        resolve(document.querySelector('script:not([src])').innerHTML.match(/https:\/\/www\.patreon\.com\/api\/user\/\d+/)[0].slice(33))
        break
      case 'subscribestar':
        resolve(document.location.pathname.split('/')[1])
        break
    }
  })

  p0.then(user => {
    const p1 = new Promise((resolve, reject) => {
      const url = 'https://yiff.party/' + host + '/' + user
      GM.xmlHttpRequest({
        method: 'HEAD',
        url: url,
        onload: response => response.status === 200 ? resolve(url) : reject(),
        onerror: error => reject(error)
      })
    })

    const p2 = new Promise((resolve, reject) => {
      const url = 'https://kemono.party/' + host + '/user/' + user
      GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: response => response.responseText.includes('<h1 class="subtitle">Nobody here but us chickens!</h1>') ? reject() : resolve(url),
        onerror: error => reject(error)
      })
    })

    Promise.allSettled([p1, p2]).then(values => {
      if (values.map(x => x.status).includes('fulfilled')) document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="voyp"><div>ViewOnYP</div></div>')
      if (values[0].value) document.getElementById('voyp').insertAdjacentHTML('beforeend', 'yiff.party: <a href="' + values[0].value + '">' + values[0].value + '</a><br>')
      if (values[1].value) document.getElementById('voyp').insertAdjacentHTML('beforeend', 'Kemono: <a href="' + values[1].value + '">' + values[1].value + '</a><br>')
    })
  })
})()

// @license-end
