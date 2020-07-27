// ==UserScript==
// @name           T3ResizableConsole
// @namespace      https://github.com/TheLastZombie/
// @version        1.0.1
// @description    Makes TYPO3's debug console resizable.
// @description:de Erlaubt die Höhenänderung der TYPO3-Debug-Konsole.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/T3ResizableConsole.user.js
// @author         TheLastZombie
// @match          *://*/typo3/index.php*
// @grant          none
// @require        https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js
// @icon           https://raw.githubusercontent.com/TYPO3-Console/TYPO3-Console/latest/Resources/Private/ExtensionArtifacts/Resources/Public/Icons/Extension.png
// ==/UserScript==

(function() {

    interact("#typo3-debug-console").resizable({
        edges: {
            top: true
        }
    })
    .on("resizemove", event => {
        document.querySelectorAll(".t3js-messages.messages")[0].style.height = (event.rect.height - 77) + "px";
    }).on("resizestart", () => {
        document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents = "none";
    }).on("resizeend", () => {
        document.querySelectorAll("#typo3-contentIframe")[0].style.pointerEvents = "initial";
    });

    // resizestart and resizeend events are required due to the iframe displayed above the console.
    // See https://github.com/taye/interact.js/issues/200 for details.

})();
