// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */
/* globals interact */

// ==UserScript==
// @name            T3ResizableConsole
// @name:de         T3ResizableConsole
// @name:en         T3ResizableConsole
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.7
// @description     Makes TYPO3's debug console resizable.
// @description:de  Erlaubt die Höhenänderung der TYPO3-Debug-Konsole.
// @description:en  Makes TYPO3's debug console resizable.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=T3ResizableConsole
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/T3ResizableConsole.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/T3ResizableConsole.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           *://*/typo3/index.php*
// @grant           none
// @require         https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/T3ResizableConsole.png
// @copyright       2020-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  interact("#typo3-debug-console")
    .resizable({
      edges: {
        top: true,
      },
    })
    .on("resizemove", (event) => {
      document.querySelectorAll(".t3js-messages.messages")[0].style.height =
        event.rect.height - 77 + "px";
    })
    .on("resizestart", () => {
      document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents =
        "none";
    })
    .on("resizeend", () => {
      document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents =
        "initial";
    });

  // resizestart and resizeend events are required due to the iframe displayed above the console.
  // See https://github.com/taye/interact.js/issues/200 for details.
})();

// @license-end
