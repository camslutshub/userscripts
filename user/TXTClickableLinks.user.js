// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            TXTClickableLinks
// @name:de         TXTClickableLinks
// @name:en         TXTClickableLinks
// @namespace       https://github.com/TheLastZombie/
// @version         1.1.3
// @description     Converts URLs in plain text files to clickable links.
// @description:de  Konvertiert URLs in Textdateien zu anklickbaren Links.
// @description:en  Converts URLs in plain text files to clickable links.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=TXTClickableLinks
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/TXTClickableLinks.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/TXTClickableLinks.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           *://*/*
// @grant           none
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/TXTClickableLinks.png
// @copyright       2021-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  // Regular Expression for URL validation
  //
  // Copyright (c) 2010-2018 Diego Perini (http://www.iport.it)
  //
  // Permission is hereby granted, free of charge, to any person
  // obtaining a copy of this software and associated documentation
  // files (the "Software"), to deal in the Software without
  // restriction, including without limitation the rights to use,
  // copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the
  // Software is furnished to do so, subject to the following
  // conditions:
  //
  // The above copyright notice and this permission notice shall be
  // included in all copies or substantial portions of the Software.
  const reWeburl =
    /((?:(?:(?:https?|ftp|file):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?)/gi;

  if (
    (document.body.childElementCount === 1 &&
      document.body.getElementsByTagName("pre")[0].getAttribute("style") ===
        "word-wrap: break-word; white-space: pre-wrap;") || // Chrome
    document.getElementsByTagName("link")[0].getAttribute("href") ===
      "resource://content-accessible/plaintext.css" // Firefox
  ) {
    const pre = document.getElementsByTagName("pre")[0];
    pre.innerHTML = pre.innerHTML.replace(reWeburl, '<a href="$1">$1</a>');
  }
})();

// @license-end
