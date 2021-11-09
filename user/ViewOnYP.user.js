// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */

// ==UserScript==
// @name            ViewOnYP
// @name:de         ViewOnYP
// @name:en         ViewOnYP
// @namespace       https://github.com/TheLastZombie/
// @version         2.5.0
// @description     Links various membership platforms to Kemono and OFans.party.
// @description:de  Vernetzt verschiedene Mitgliedschaftsplattformen mit Kemono und OFans.party.
// @description:en  Links various membership platforms to Kemono and OFans.party.
// @homepageURL     https://github.com/TheLastZombie/userscripts#viewonyp-
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=ViewOnYP
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/ViewOnYP.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/ViewOnYP.meta.js
// @author          TheLastZombie
// @match           *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @match           *://*.fanbox.cc/
// @match           *://fantia.jp/fanclubs/*
// @match           *://gumroad.com/*
// @match           *://www.patreon.com/*
// @match           *://www.subscribestar.com/*
// @match           *://subscribestar.adult/*
// @connect         kemono.party
// @connect         api.fanbox.cc
// @grant           GM.deleteValue
// @grant           GM_deleteValue
// @grant           GM.getValue
// @grant           GM_getValue
// @grant           GM.registerMenuCommand
// @grant           GM_registerMenuCommand
// @grant           GM.setValue
// @grant           GM_setValue
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ViewOnYP.ico
// @copyright       2020-2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(async function () {
  GM.registerMenuCommand('Clear cache', () => {
    GM.deleteValue('cache2')
      .then(alert('Cache cleared successfully.'))
  })

  if (!await GM.getValue('cache2')) await GM.setValue('cache2', {})
  const cache = await GM.getValue('cache2')

  if (await GM.getValue('cache')) {
    cache.Kemono = await GM.getValue('cache')
    await GM.deleteValue('cache')
  }

  const sites = [
    {
      name: 'Kemono',
      url: 'https://kemono.party/$HOST/user/$USER'
    }
  ]

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
      case 'fantia':
        resolve(document.location.pathname.split('/')[2])
        break
      case 'gumroad':
        resolve(document.querySelector('.creator-profile-wrapper').getAttribute('data-username'))
        break
      case 'patreon':
        resolve(document.head.innerHTML.match(/https:\/\/www\.patreon\.com\/api\/user\/\d+/)[0].slice(33))
        break
      case 'subscribestar':
        resolve(document.location.pathname.split('/')[1])
        break
    }
  })

  p.then(user => {
    sites.forEach(x => {
      if (cache[x.name] && cache[x.name][host] && cache[x.name][host].includes(user)) return show(x, host, user)

      const url = x.url.replace('$HOST', host).replace('$USER', user)
      GM.xmlHttpRequest({
        url: url,
        method: 'HEAD',
        onload: response => {
          if (response.status === 200 && response.finalUrl === url) show(x, host, user)
        }
      })
    })
  })

  function show (site, host, user) {
    if (!document.getElementById('voyp')) document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="voyp"><div>ViewOnYP</div></div>')

    const name = site.name
    const url = site.url.replace('$HOST', host).replace('$USER', user)

    document.getElementById('voyp').insertAdjacentHTML('beforeend', name + ': <a href="' + url + '">' + url + '</a><br>')

    if (!cache[site.name]) cache[site.name] = {}
    if (!cache[site.name][host]) cache[site.name][host] = []
    if (!cache[site.name][host].includes(user)) cache[site.name][host].push(user)
    GM.setValue('cache2', cache)
  }
})()

// @license-end
