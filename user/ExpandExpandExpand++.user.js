// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           ExpandExpandExpand++
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.3
// @description    Modification of "GitHub PR: expand, expand, expand!" with multiple small improvements.
// @description:de Modifikation von "GitHub PR: expand, expand, expand!" mit mehreren kleinen Verbesserungen.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=ExpandExpandExpand%2B%2B
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/ExpandExpandExpand++.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/ExpandExpandExpand++.meta.js
// @author         findepi, TheLastZombie
// @match          https://github.com/*/*/issues/*
// @match          https://github.com/*/*/pull/*
// @grant          none
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ExpandExpandExpand++.png
// @license        MIT
// ==/UserScript==

(function () {
  if (document.getElementsByClassName('ajax-pagination-btn').length) document.getElementsByClassName('pagehead-actions')[0].insertAdjacentHTML('afterbegin', "<li><a id='_f_expand_expand' class='btn btn-sm'>Expand all</a></li>")
  document.getElementById('_f_expand_expand').onclick = expand

  function expand () {
    const btnMeta = document.getElementById('_f_expand_expand')
    const btnLoad = Array.from(document.querySelectorAll('.ajax-pagination-btn')).filter(x => x.textContent.includes('Load more'))[0]
    const btnWait = Array.from(document.querySelectorAll('.ajax-pagination-btn')).filter(x => x.textContent.includes('Loading'))[0]

    btnMeta.setAttribute('aria-disabled', 'true')

    if (btnLoad) {
      btnMeta.innerHTML = 'Expanding ' + btnLoad.previousElementSibling.textContent.match(/\d+/).toString() + ' items...'
      btnLoad.click()
      setTimeout(expand, 25)
    } else if (btnWait) {
      setTimeout(expand, 25)
    } else {
      btnMeta.parentNode.removeChild(btnMeta)
    }
  }
})()

// @license-end
