// ==UserScript==
// @name           TracklistToRYM
// @namespace      https://github.com/TheLastZombie/
// @version        1.21.1
// @description    Imports an album's tracklist from various sources into Rate Your Music.
// @description:de Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @homepageURL    https://github.com/TheLastZombie/userscripts#tracklisttorym-
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=TracklistToRYM
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/TracklistToRYM.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/TracklistToRYM.meta.js
// @author         TheLastZombie
// @match          https://rateyourmusic.com/releases/ac
// @match          https://rateyourmusic.com/releases/ac?*
// @connect        allmusic.com
// @connect        amazon.com
// @connect        apple.com
// @connect        pulsewidth.org.uk
// @connect        bandcamp.com
// @connect        beatport.com
// @connect        deezer.com
// @connect        discogs.com
// @connect        freemusicarchive.org
// @connect        genius.com
// @connect        archive.org
// @connect        junodownload.com
// @connect        khinsider.com
// @connect        last.fm
// @connect        loot.co.za
// @connect        metal-archives.com
// @connect        musicbrainz.org
// @connect        musik-sammler.de
// @connect        napster.com
// @connect        naxos.com
// @connect        rateyourmusic.com
// @connect        sonemic.com
// @connect        qobuz.com
// @connect        vgmdb.net
// @connect        vinyl-digital.com
// @connect        youtube.com
// @connect        *
// @grant          GM.deleteValue
// @grant          GM_deleteValue
// @grant          GM.getValue
// @grant          GM_getValue
// @grant          GM.listValues
// @grant          GM_listValues
// @grant          GM.setValue
// @grant          GM_setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/TracklistToRYM.png
// @copyright      2020-2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license        MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==
