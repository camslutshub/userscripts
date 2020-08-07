// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
// This notice, as well as the @license-end at the very end, are required for LibreJS so it knows this script is licensed under the MIT license.
// This has to be the first line in the file. See https://www.gnu.org/software/librejs/free-your-javascript.html for details.

// ==UserScript==
// @name           TracklistToRYM
// @namespace      https://github.com/TheLastZombie/
// @version        1.9.0
// @description    Imports an album's tracklist from various sources into Rate Your Music.
// @description:de Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=TracklistToRYM
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/TracklistToRYM.user.js
// @author         TheLastZombie
// @match          https://rateyourmusic.com/releases/ac
// @match          https://rateyourmusic.com/releases/ac?*
// @connect        allmusic.com
// @connect        amazon.com
// @connect        apple.com
// @connect        bandcamp.com
// @connect        beatport.com
// @connect        deezer.com
// @connect        discogs.com
// @connect        freemusicarchive.org
// @connect        genius.com
// @connect        google.com
// @connect        junodownload.com
// @connect        last.fm
// @connect        loot.co.za
// @connect        metal-archives.com
// @connect        musicbrainz.org
// @connect        musik-sammler.de
// @connect        naxos.com
// @connect        qobuz.com
// @connect        youtube.com
// @connect        *
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://e.snmc.io/2.5/img/sonemic.png
// @license        MIT
// ==/UserScript==

(function () {

    // Get the box that contains the "Copy tracks" feature.
    // It doesn't have a special ID or even class, so getting the button of that feature and moving to its parent seems like the best solution.
    const parent = $("input[value='Copy Tracks']").parent();

    // Add the site configurations. If this script had a heart, this would be it.
    // It contains a name (used as identifier and in the <select> menu), tells the script which extractor to use (see below), has a placeholder as a kind of hint for the user, and finally, contains the parent, index, title and length properties, which the extractors use to get the actual content.
    // Note that parent does not mean parent for all tracks, but rather each track individually. Consider a structure like this:
    // <x><y>Track</y>...<y>Track</y></x>
    // Here, the parent would be each <y> element, not the one <x> element.
    const sites = [
        {
            name: "AllMusic",
            extractor: "node",
            placeholder: "https://www.allmusic.com/album/*",
            parent: ".track",
            index: ".tracknum",
            title: ".title a",
            length: ".time"
        },
        {
            name: "Amazon",
            extractor: "node",
            placeholder: "https://www.amazon.com/dp/*",
            parent: "#dmusic_tracklist_content .a-text-left",
            index: ".TrackNumber-Default-Color",
            title: ".TitleLink",
            length: ".a-size-small.a-color-secondary"
        },
        {
            name: "Apple Music",
            extractor: "node",
            placeholder: "https://music.apple.com/*/album/*",
            parent: ".row.song",
            index: ".song-index .column-data",
            title: ".song-name",
            length: ".time-data"
        },
        {
            name: "Bandcamp",
            extractor: "node",
            placeholder: "https://*.bandcamp.com/album/*",
            parent: ".title-col",
            index: false,
            title: ".track-title",
            length: ".time"
        },
        {
            name: "Beatport",
            extractor: "node",
            placeholder: "https://www.beatport.com/release/*/*",
            parent: ".track",
            index: ".buk-track-num",
            title: ".buk-track-primary-title",
            length: ".buk-track-length"
        },
        {
            name: "Beatport Classic",
            extractor: "node",
            placeholder: "http://classic.beatport.com/release/*/*",
            parent: ".track-grid-content",
            index: ".playColumn .artWrapper",
            title: ".titleColumn .txt-larger > span:not(.txt-grey)",
            length: false
        },
        {
            name: "Deezer",
            extractor: "node",
            placeholder: "https://deezer.com/album/*",
            parent: ".song",
            index: ".number",
            title: "[itemprop='name']",
            length: ".timestamp"
        },
        {
            name: "Discogs",
            extractor: "node",
            placeholder: "https://discogs.com/release/*",
            parent: ".tracklist_track:not(.track_heading)",
            index: ".tracklist_track_pos",
            title: ".tracklist_track_title > span",
            length: ".tracklist_track_duration span"
        },
        {
            name: "Free Music Archive",
            extractor: "node",
            placeholder: "https://freemusicarchive.org/music/*/*",
            parent: ".play-item",
            index: ".playtxt > b",
            title: ".playtxt > a > b",
            length: false
        },
        {
            name: "Genius",
            extractor: "node",
            placeholder: "https://genius.com/albums/*/*",
            parent: ".chart_row",
            index: "chart_row-number_container-number",
            title: ".chart_row-content-title",
            length: false
        },
        {
            name: "Google Play",
            extractor: "node",
            placeholder: "https://play.google.com/store/music/album/*",
            parent: "[data-album-is-available]",
            index: "[data-update-url-on-play] div",
            title: "[itemprop='name']",
            length: "[aria-label]"
        },
        {
            name: "Juno Download",
            extractor: "node",
            placeholder: "https://www.junodownload.com/products/*",
            parent: ".product-tracklist-track",
            index: ".track-title",
            title: "[itemprop='name']",
            length: ".col-1"
        },
        {
            name: "Last.fm",
            extractor: "node",
            placeholder: "https://www.last.fm/music/*/*",
            parent: ".chartlist-row",
            index: ".chartlist-index",
            title: ".chartlist-name a",
            length: ".chartlist-duration"
        },
        {
            name: "Loot.co.za",
            extractor: "node",
            placeholder: "https://www.loot.co.za/product/*/*",
            parent: "#tabs div:nth-last-child(2) .productDetails tr:not([style])",
            index: "td[width]",
            title: "td:not([width])",
            length: false
        },
        {
            name: "Metal Archives",
            extractor: "node",
            placeholder: "https://www.metal-archives.com/albums/*/*/*",
            parent: ".table_lyrics .even, .table_lyrics .odd",
            index: "td",
            title: ".wrapWords",
            length: "td[align='right']"
        },
        {
            name: "MusicBrainz",
            extractor: "node",
            placeholder: "https://musicbrainz.org/release/*",
            parent: "#content tr.odd, #content tr.even",
            index: "td.pos",
            title: "td > a bdi, td .name-variation > a bdi",
            length: "td.treleases"
        },
        {
            name: "Musik-Sammler",
            extractor: "node",
            placeholder: "https://www.musik-sammler.de/release/*",
            parent: "[itemprop='track'] tbody tr",
            index: ".track-position",
            title: ".track-title span",
            length: ".track-time"
        },
        {
            name: "Naxos Records",
            extractor: "node",
            placeholder: "https://www.naxos.com/catalogue/item.asp?item_code=*",
            parent: "table[valign='top']",
            index: "td:first-child",
            title: "td:nth-child(4) b",
            length: "td:nth-child(4)"
        },
        {
            name: "Qobuz",
            extractor: "node",
            placeholder: "https://www.qobuz.com/*/album/*/*",
            parent: ".track",
            index: ".track__item--number span",
            title: ".track__item--name span",
            length: ".track__item--duration"
        },
        {
            name: "YouTube Music",
            extractor: "regex",
            placeholder: "https://music.youtube.com/playlist?list=*",
            parent: /{\\"musicTrack\\":.*?}}}},/g,
            index: /(?<=\\"albumTrackIndex\\":\\").*?(?=\\",)/,
            title: /(?<=\\"title\\":\\").*?(?=\\",)/,
            length: false
        }
    ];

    // Enlarge the box we selected earlier to fit all the content we are going to insert.
    // After that, insert the "Or import tracklists" text, add the selection menu by mapping the `sites` object and add input field, button and checkboxes.
    parent.width(489);
    parent.append("<br><br>Or import tracklists from other sources using TracklistToRYM.<p style='display:flex'><select id='ttrym-site'>"
        + sites.map(x => "<option value='" + x.name + "'>" + x.name + "</option>").join("")
        + "</select><input id='ttrym-link' placeholder='Album URL' style='flex:1'></input><button id='ttrym-submit'>Import</button></p>"
        + "<p><input id='ttrym-sources' name='ttrym-sources' type='checkbox' checked><label for='ttrym-sources'> Add URL to sources </label>"
        + "<input id='ttrym-append' name='ttrym-append' type='checkbox'><label for='ttrym-append'> Append instead of replace </label></p>");

    // To change the placeholder in the input field when the user switches to another site, we'll have to modify it on every `change`.
    // At this point, the input field doesn't contain a placeholder yet, but simply triggering said event will take care of that.
    $("#ttrym-site").bind("change", function () {
        $("#ttrym-link").attr("placeholder", sites.filter(x => x.name == $(this).val())[0].placeholder);
    });
    $("#ttrym-site").trigger("change");

    $("#ttrym-submit").click(function () {

        // Do some initial checks, in this case remove all previous messages and, if the user did not enter anything, return immediately and tell the user to do so.
        // #ttrym-success, #ttrym-warning, #ttrym-error are currently the only three types of messages sent by TracklistToRYM.
        // If the user did enter a URL, display the "Importing, please wait" message.
        $("#ttrym-success, #ttrym-warning, #ttrym-error").remove();
        if (!$("#ttrym-link").val()) return parent.append("<p id='ttrym-error' style='color:red'>No URL specified! Please enter one and try again.</p>");
        parent.append("<p id='ttrym-info' style='color:#777'>Importing, please wait...</p>");

        try {

            const site = $("#ttrym-site").val();
            const input = sites.filter(x => x.name == site)[0];
            const link = $("#ttrym-link").val();

            // Parse the placeholder from above and convert it into a regular expression.
            // Then evaluate the user's input against it and, if it doesn't match, warn the user, but continue anyway.
            // Exiting here is not recommended since most sites have, for example, `www` subdomains.
            // Adding all of these will make the placeholder longer and, in the end, simply confuse the user.
            if (!new RegExp(input.placeholder
                .replace(/[.+\-?^${}()|[\]\\]/g, "\\$&")
                .replace(/\*/g, ".*")
            ).test(link)) {
                parent.append("<p id='ttrym-warning' style='color:orange'>Warning: Entered URL does not match the selected site's placeholder. Request may not succeed.</p>");
            };

            // Using the userscript's engine's GM_xmlHttpRequest function allows us to bypass CORS restrictions.
            // See https://github.com/scriptish/scriptish/wiki/GM_xmlhttpRequest for details.
            // For compatibility with APIs < Greasemonkey 4, `gm4-polyfill` is loaded (see the @require in the metadata block).
            GM.xmlHttpRequest({
                method: "GET",
                url: link,
                onload: (response) => {

                    var data = response.responseText;

                    var result = "";
                    var amount = 0;

                    // Below are the extractors mentioned above and specified in the `sites` object.
                    // Most sites allow us to grab data via their HTML elements, however some generate these automatically.
                    // For these, the `regex` extractor was added. It's not ideal, but a headless browser wouldn't be either.
                    switch (input.extractor) {

                        case "node":
                            $(data).find(input.parent).each(function () {
                                amount++;
                                var index = $(this).find(input.index).first().clone().children().remove().end().text().trim().replace(/^0+/, "").replace(/\.$/, "") || amount;
                                var title = $(this).find(input.title).first().clone().children().remove().end().text().trim() || "";
                                var length = $(this).find(input.length).first().clone().children().remove().end().text().trim() || "";
                                result += index + "|" + title + "|" + length + "\n";
                            });
                            break;

                        case "regex":
                            data.match(input.parent).forEach(function (i) {
                                amount++;
                                var index = input.index ? i.match(input.index).toString().replace(/^0+/, "").replace(/\.$/, "") : amount;
                                var title = input.title ? i.match(input.title) : "";
                                var length = input.length ? i.match(input.length) : "";
                                result += index + "|" + title + "|" + length + "\n";
                            });
                            break;

                        // If there are no matching extractors, ask the user to report the issue on GitHub. Title and tags are automatically filled via URL parameters.
                        // See https://docs.github.com/en/github/managing-your-work-on-github/about-automation-for-issues-and-pull-requests-with-query-parameters for details.
                        default:
                            $("#ttrym-info, #ttrym-warning").remove();
                            return parent.append("<p id='ttrym-error' style='color:red'>Error: " + input.extractor + " is not a valid extractor. This is (probably) not your fault, please report this on <a href=''>GitHub</a>.</p>");

                    };

                    // If all seemed to go well, but there are no tracks, the user probably entered a wrong URL and the selectors didn't match anything.
                    if (amount == 0) {
                        $("#ttrym-info").remove();
                        return parent.append("<p id='ttrym-warning' style='color:orange'>Did not find any tracks. Please check your URL and try again.</p>");
                    };

                    // Once everything is verified, add the actual tracks to the track list.
                    // This is pretty easy, since RateYourMusic offers an "advanced" mode which allows you to use a single textarea.
                    // goAdvanced() and goSimple() are functions by RateYourMusic to toggle between simple and advanced modes.
                    // Since the simple mode is shown by defeault, return to it once the data has been input.
                    goAdvanced();
                    $("#track_advanced").val($("#ttrym-append").prop("checked") ? $("#track_advanced").val() + result : result);
                    goSimple();

                    // If the user has the "Add URL to sources" checkbox ticked, do just that.
                    // After that, clear the input field so the user can enter another URL if he wants to.
                    if ($("#ttrym-sources").prop("checked") && !$("#notes").val().includes($("#ttrym-link").val())) {
                        $("#notes").val($("#notes").val() + ($("#notes").val() == "" ? "" : "\n") + $("#ttrym-link").val());
                    };
                    $("#ttrym-link").val("");

                    // Finally, tell the user how many tracks have been imported, counted by the `amount` variable earlier.
                    parent.append("<p id='ttrym-success' style='color:green'>Successfully imported " + amount + " tracks.</p>");
                    $("#ttrym-info").remove();

                },

                // If the request failed, display the response text to the user. This could be a "404 Not Found" or something similar, set by the webpage.
                onerror: () => {
                    parent.append("<p id='ttrym-error' style='color:red'>" + response.responseText + "</p>");
                    $("#ttrym-info").remove();
                }
            });

        // If the request succeeded but something else broke, display the error directly.
        } catch (e) {
            parent.append("<p id='ttrym-error' style='color:red'>" + e.toString() + "</p>");
            $("#ttrym-info").remove();
        };

    });

})();

// @license-end
