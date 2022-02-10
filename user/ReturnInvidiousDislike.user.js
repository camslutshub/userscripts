// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            ReturnInvidiousDislike
// @name:de         ReturnInvidiousDislike
// @name:en         ReturnInvidiousDislike
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.2
// @description     Displays the dislike count of videos accessed via Invidious.
// @description:de  Zeigt die Dislike-Anzahl von Videos auf Invidious an.
// @description:en  Displays the dislike count of videos accessed via Invidious.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=ReturnInvidiousDislike
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/ReturnInvidiousDislike.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/ReturnInvidiousDislike.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           *://*/watch?v=*
// @connect         return-youtube-dislike-api.azurewebsites.net
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ReturnInvidiousDislike.png
// @copyright       2021-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(function () {
  const video = new URLSearchParams(window.location.search).get("v");
  const views = document.getElementById("views")?.childNodes[1];
  const likes = document.getElementById("likes")?.childNodes[1];
  const dislikes = document.getElementById("dislikes")?.childNodes[1];
  const rating = document.getElementById("rating");

  if (video && views && likes && dislikes && rating) {
    GM.xmlHttpRequest({
      url:
        "https://return-youtube-dislike-api.azurewebsites.net/votes?videoId=" +
        video,
      onload: (response) => {
        const data = JSON.parse(response.responseText);

        views.textContent = " " + data.viewCount.toLocaleString();
        likes.textContent = " " + data.likes.toLocaleString();
        dislikes.textContent = " " + data.dislikes.toLocaleString();
        rating.textContent = "Rating: " + data.rating.toFixed(4) + " / 5";
      },
    });
  }
})();
