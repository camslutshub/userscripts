// ==UserScript==
// @name            VGMLoaderX
// @name:de         VGMLoaderX
// @name:en         VGMLoaderX
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.6
// @description     Automatically downloads albums from KHInsider without an account.
// @description:de  Lädt Alben von KHInsider automatisch und ohne Account herunter.
// @description:en  Automatically downloads albums from KHInsider without an account.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=VGMLoaderX
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/main/user/VGMLoaderX.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/main/meta/VGMLoaderX.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           https://downloads.khinsider.com/game-soundtracks/album/*
// @connect         vgmsite.com
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://cdn.jsdelivr.net/gh/gildas-lormeau/zip.js@7949db15556ebdbd076e543fd77134286ad6e4fc/dist/zip.min.js
// @require         https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js@5bb701bd6ea05a02836daf8ef88ec350a1dd4d83/dist/FileSaver.min.js
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/main/icons/VGMLoaderX.ico
// @copyright       2021-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/main/LICENSE
// ==/UserScript==
