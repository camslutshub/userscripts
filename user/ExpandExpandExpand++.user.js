// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           ExpandExpandExpand++
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.1
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
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ExpandExpandExpand++.png
// @license        MIT
// ==/UserScript==

(function () {
  if ($('.ajax-pagination-btn').length) $('.pagehead-actions').prepend("<li><a id='_f_expand_expand' class='btn btn-sm'>Expand all</a></li>")
  $('#_f_expand_expand').click(expand)

  function expand () {
    var btnMeta = $('#_f_expand_expand')
    var btnLoad = $('.ajax-pagination-btn:visible:contains(Load more)')
    var btnWait = $('.ajax-pagination-btn:visible:contains(Loading)')

    btnMeta.attr('aria-disabled', 'true')

    if (btnLoad.length) {
      btnMeta.text('Expanding ' + btnLoad.prev().text().match(/\d+/).toString() + ' items...')
      btnLoad.click()
      setTimeout(expand, 25)
    } else if (btnWait.length) {
      setTimeout(expand, 25)
    } else {
      btnMeta.remove()
    }
  }
})()

// @license-end