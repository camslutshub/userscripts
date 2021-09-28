// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* global semver */

// ==UserScript==
// @name            T3Xtend
// @name:de         T3Xtend
// @name:en         T3Xtend
// @namespace       https://github.com/TheLastZombie/
// @version         1.3.0
// @description     Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @description:de  Zeigt sowohl T3X- als auch Download-Links zu alten Versionen von TYPO3-Extensions.
// @description:en  Adds T3X buttons as well as download links to old versions of TYPO3 extensions.
// @homepageURL     https://github.com/TheLastZombie/userscripts#t3xtend-
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=T3Xtend
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/T3Xtend.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/T3Xtend.meta.js
// @author          TheLastZombie
// @match           https://extensions.typo3.org/extension/*
// @connect         ia801807.us.archive.org
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://bundle.run/semver@7.3.5
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/T3Xtend.ico
// @copyright       2020-2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(async function () {
  // Shorten button text

  document.querySelectorAll('.ter-ext-single-versionhistory .btn-primary').forEach(x => {
    x.textContent = x.textContent.replace('Download', 'ZIP')
  })

  // Add buttons to old versions

  document.querySelectorAll('.ter-ext-single-versionhistory tr.table-danger td:first-child strong').forEach(x => {
    x
      .parentNode
      .parentNode
      .querySelectorAll('td:last-child')[0]
      .insertAdjacentHTML('beforeend', "<a class='btn btn-primary' href='/extension/download/" +
        window.location.pathname.split('/')[2] +
        '/' +
        x.textContent +
        "/zip'>ZIP</a>")
  })

  // Add entries for Packagist-only versions

  if (document.getElementById('install-composer')) {
    const input = document.querySelector('#install-composer kbd').innerText.replace('composer req ', '')
    const response = await fetch('https://repo.packagist.org/p2/' + input + '.json')
    const data = await response.json()

    data.packages[input].slice(1).forEach(x => {
      if (!document.getElementById(x.version) && !document.getElementById('v' + x.version)) {
        for (const y of document.querySelectorAll('tbody tr')) {
          if (semver.gt(x.version.replace(/^v/, ''), y.getElementsByTagName('strong')[0].innerText)) {
            y.insertAdjacentHTML('beforebegin', '<tr data-versions=""><td class="align-middle" colspan="3"><strong>' + x.version.replace(/^v/, '') + '</strong> / <span>composer</span><br><small>' + new Date(x.time).toLocaleString([], {
              month: 'long',
              day: '2-digit',
              year: 'numeric'
            }) + '</small></td><td class="align-middle composer"><a class="btn btn-primary" href="' + x.dist.url + '"><strong>ZIP</strong></a></td></tr>')
            break
          }
        }
      }
    })
  }

  // Add T3X download buttons

  document.querySelectorAll('.ter-ext-single-versionhistory .btn-primary:first-child').forEach(x => {
    const button = x.cloneNode(true)
    button.setAttribute('href', x.getAttribute('href').replace('/zip', '/t3x'))
    button.setAttribute('title', '')
    if (x.parentNode.classList.contains('composer')) button.classList.add('disabled')
    button.textContent = 'T3X'
    x.insertAdjacentElement('afterend', button)
  })

  // Add Composer command buttons

  if (document.getElementById('install-composer')) {
    document.querySelectorAll('.ter-ext-single-versionhistory .btn-primary:first-child').forEach(x => {
      const button = x.cloneNode(true)
      button.setAttribute('href', 'javascript:void(0)')
      button.setAttribute('onclick', 'copyToClipboard(this)')
      button.setAttribute('title', '')
      button.setAttribute('data-message', 'Composer require command is in your clipboard now')
      button.innerHTML = '<svg style="width:18px;height:18px;position:relative;top:-1px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg><span style="display:none">' + document.querySelectorAll('#install-composer kbd')[0].textContent + ':' + x.parentNode.parentNode.firstElementChild.firstElementChild.textContent + '</span>'
      x.insertAdjacentElement('afterend', button)
    })
  }

  // Improve button styles

  document.querySelectorAll('.ter-ext-single-versionhistory .btn-primary').forEach(x => {
    x.style.paddingLeft = '1rem'
    x.style.paddingRight = '1rem'
    x.parentNode.style.display = 'flex'
    x.parentNode.style.justifyContent = 'space-around'
    x.parentNode.style.position = 'relative'
    x.parentNode.style.top = '-1px'
  })

  // Replace to-be-deleted documentation links

  const x = document.getElementsByClassName('btn-info')[0].getAttribute('href').split('/')
  const y = 'https://ia801807.us.archive.org/view_archive.php?archive=/12/items/ter-archive/docs.zip&file=' + x[5] + '%20' + x[6] + '.html'
  if (x.length !== 7) return
  GM.xmlHttpRequest({
    method: 'GET',
    url: y,
    onload: response => response.responseText ? document.getElementsByClassName('btn-info')[0].setAttribute('href', y) : ''
  })
})()

// @license-end
