// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            ViewOnYPMemoryHole
// @name:de         ViewOnYPMemoryHole
// @name:en         ViewOnYPMemoryHole
// @namespace       https://github.com/TheLastZombie/
// @version         1.0.2
// @description     An add-on for ViewOnYP that adds support for Memory Hole.
// @description:de  Ein Add-on für ViewOnYP, das Unterstützung für Memory Hole hinzufügt.
// @description:en  An add-on for ViewOnYP that adds support for Memory Hole.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=ViewOnYPMemoryHole
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/ViewOnYPMemoryHole.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/ViewOnYPMemoryHole.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           *://www.patreon.com/*
// @connect         api.memoryhole.cc
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
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/ViewOnYPMemoryHole.png
// @copyright       2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(async function () {
  if (!(await GM.getValue("cache2"))) await GM.setValue("cache2", {});
  const cache = await GM.getValue("cache2");

  GM.registerMenuCommand("Clear cache", () => {
    GM.deleteValue("cache2").then(alert("Cache cleared successfully."));
  });

  const campaign = document.head.innerHTML
    .match(/"id": "\d+?"/)[0]
    .slice(7, -1);

  if (cache[campaign]) return show(cache[campaign]);

  GM.xmlHttpRequest({
    url: "https://api.memoryhole.cc/graphql",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      query:
        "query { getPatreonByCampaignId (campaignId: " +
        campaign +
        ") { creator { id } } }",
    }),
    onload: (response) => {
      const id = JSON.parse(response.responseText).data?.getPatreonByCampaignId
        ?.creator?.id;

      if (id) show(id);
    },
  });

  function show(id) {
    if (document.getElementById("voyp")) {
      insert(id);
    } else {
      const observer = new MutationObserver(() => {
        if (document.getElementById("voyp")) insert(id);
      });
      observer.observe(document.body, { childList: true });
    }

    if (!cache[campaign]) cache[campaign] = id;
    GM.setValue("cache2", cache);
  }

  function insert(id) {
    document
      .getElementById("voyp")
      .insertAdjacentHTML(
        "beforeend",
        '<br>Memory Hole: <a href="https://memoryhole.cc/creator/' +
          id +
          '">https://memoryhole.cc/creator/' +
          id +
          "</a>"
      );

    // eslint-disable-next-line no-func-assign
    insert = () => {}; // jshint ignore:line
  }
})();

// @license-end
