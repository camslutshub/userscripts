// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            Collapsit
// @name:de         Collapsit
// @name:en         Collapsit
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.8
// @description     Enables collapsing (and expanding) of comments on Removeddit.
// @description:de  Ermöglicht das Ein- und Ausklappen von Kommentaren auf Removeddit.
// @description:en  Enables collapsing (and expanding) of comments on Removeddit.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=Collapsit
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/main/user/Collapsit.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/main/meta/Collapsit.meta.js
// @author          TheLastZombie <roesch.eric+userscripts@protonmail.com>
// @match           *://*.removeddit.com/r/*/comments/*
// @grant           none
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/main/icons/Collapsit.ico
// @copyright       2020-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/main/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    if (
      event.target &&
      event.target.matches(".comment-head .author:not(.comment-author)")
    ) {
      event.preventDefault();
      if (event.target.textContent === "[–]") {
        Array.from(event.target.parentNode.parentNode.children)
          .slice(1)
          .forEach((x) => {
            x.style.display = "none";
          });
        event.target.textContent = "[+]";
      } else {
        Array.from(event.target.parentNode.parentNode.children)
          .slice(1)
          .forEach((x) => {
            x.style.display = "";
          });
        event.target.textContent = "[–]";
      }
    }
  });
})();

// @license-end
