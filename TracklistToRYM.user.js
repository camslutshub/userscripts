// ==UserScript==
// @name           TracklistToRYM
// @namespace      https://github.com/TheLastZombie/
// @version        1.6.1
// @description    Imports an album's tracklist from various sources into Rate Your Music.
// @description:de Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/TracklistToRYM.user.js
// @author         TheLastZombie
// @match          https://rateyourmusic.com/releases/ac
// @match          https://rateyourmusic.com/releases/ac?*
// @connect        allmusic.com
// @connect        apple.com
// @connect        bandcamp.com
// @connect        beatport.com
// @connect        deezer.com
// @connect        discogs.com
// @connect        genius.com
// @connect        google.com
// @connect        junodownload.com
// @connect        last.fm
// @connect        metal-archives.com
// @connect        musicbrainz.org
// @connect        musik-sammler.de
// @connect        *
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://e.snmc.io/2.5/img/sonemic.png
// ==/UserScript==

(function () {

    const parent = $("input[value='Copy Tracks']").parent();

    const sites = [
        {
            name: "AllMusic",
            placeholder: "https://www.allmusic.com/album/*",
            parent: ".track",
            index: ".tracknum",
            title: ".title a",
            length: ".time"
        },
        {
            name: "Apple Music",
            placeholder: "https://music.apple.com/*/album/*",
            parent: ".row.song",
            index: ".song-index .column-data",
            title: ".song-name",
            length: ".time-data"
        },
        {
            name: "Bandcamp",
            placeholder: "https://*.bandcamp.com/album/*",
            parent: ".title-col",
            index: false,
            title: ".track-title",
            length: ".time"
        },
        {
            name: "Beatport",
            placeholder: "https://www.beatport.com/release/*/*",
            parent: ".track",
            index: ".buk-track-num",
            title: ".buk-track-primary-title",
            length: ".buk-track-length"
        },
        {
            name: "Deezer",
            placeholder: "https://deezer.com/album/*",
            parent: ".song",
            index: ".number",
            title: "[itemprop='name']",
            length: ".timestamp"
        },
        {
            name: "Discogs",
            placeholder: "https://discogs.com/release/*",
            parent: ".tracklist_track:not(.track_heading)",
            index: ".tracklist_track_pos",
            title: ".tracklist_track_title > span",
            length: ".tracklist_track_duration span"
        },
        {
            name: "Genius",
            placeholder: "https://genius.com/albums/*/*",
            parent: ".chart_row",
            index: "chart_row-number_container-number",
            title: ".chart_row-content-title",
            length: false
        },
        {
            name: "Google Play",
            placeholder: "https://play.google.com/store/music/album/*",
            parent: "[data-album-is-available]",
            index: "[data-update-url-on-play] div",
            title: "[itemprop='name']",
            length: "[aria-label]"
        },
        {
            name: "Juno Download",
            placeholder: "https://www.junodownload.com/products/*",
            parent: ".product-tracklist-track",
            index: ".track-title",
            title: "[itemprop='name']",
            length: ".col-1"
        },
        {
            name: "Last.fm",
            placeholder: "https://www.last.fm/music/*/*",
            parent: ".chartlist-row",
            index: ".chartlist-index",
            title: ".chartlist-name a",
            length: ".chartlist-duration"
        },
        {
            name: "Metal Archives",
            placeholder: "https://www.metal-archives.com/albums/*/*/*",
            parent: ".table_lyrics .even, .table_lyrics .odd",
            index: "td",
            title: ".wrapWords",
            length: "td[align='right']"
        },
        {
            name: "MusicBrainz",
            placeholder: "https://musicbrainz.org/release/*",
            parent: "#content tr.odd, #content tr.even",
            index: "td.pos",
            title: "td > a bdi, td .name-variation > a bdi",
            length: "td.treleases"
        },
        {
            name: "Musik-Sammler",
            placeholder: "https://www.musik-sammler.de/release/*",
            parent: "[itemprop='track'] tbody tr",
            index: ".track-position",
            title: ".track-title span",
            length: ".track-time"
        }
    ];

    parent.width(489);
    parent.append("<br><br>Or import tracklists from other sources using TracklistToRYM.<p style='display:flex'><select id='ttrym-site'>"
        + sites.map(x => "<option value='" + x.name + "'>" + x.name + "</option>").join("")
        + "</select><input id='ttrym-link' placeholder='Album URL' style='flex:1'></input><button id='ttrym-submit'>Import</button></p>"
        + "<p><input id='ttrym-sources' name='ttrym-sources' type='checkbox' checked><label for='ttrym-sources'> Add URL to sources </label>"
        + "<input id='ttrym-append' name='ttrym-append' type='checkbox'><label for='ttrym-append'> Append instead of replace </label></p>");

    $("#ttrym-site").bind("change", function () {
        $("#ttrym-link").attr("placeholder", sites.filter(x => x.name == $(this).val())[0].placeholder);
    });
    $("#ttrym-site").trigger("change");

    $("#ttrym-submit").click(function () {

        $("#ttrym-success, #ttrym-warning, #ttrym-error").remove();
        if (!$("#ttrym-link").val()) return parent.append("<p id='ttrym-error' style='color:red'>No URL specified! Please enter one and try again.</p>");
        parent.append("<p id='ttrym-info' style='color:#777'>Importing, please wait...</p>");

        try {

            const site = $("#ttrym-site").val();
            const input = sites.filter(x => x.name == site)[0];
            const link = $("#ttrym-link").val();

            if (!new RegExp(input.placeholder
                .replace(/[.+\-?^${}()|[\]\\]/g, "\\$&")
                .replace(/\*/g, ".*")
            ).test(link)) {
                parent.append("<p id='ttrym-warning' style='color:orange'>Warning: Entered URL does not match the selected site's placeholder. Request may not succeed.</p>");
            };

            GM.xmlHttpRequest({
                method: "GET",
                url: link,
                onload: (response) => {

                    var data = response.responseText;

                    var result = "";
                    var amount = 0;

                    $(data).find(input.parent).each(function (i) {
                        amount++;
                        var index = $(this).find(input.index).first().clone().children().remove().end().text().trim().replace(/^0+/, "").replace(/\.$/, "") || i + 1;
                        var title = $(this).find(input.title).first().clone().children().remove().end().text().trim() || "";
                        var length = $(this).find(input.length).first().clone().children().remove().end().text().trim() || "";
                        result += index + "|" + title + "|" + length + "\n";
                    });

                    if (amount == 0) {
                        $("#ttrym-info").remove();
                        return parent.append("<p id='ttrym-warning' style='color:orange'>Did not find any tracks. Please check your URL and try again.</p>");
                    };

                    goAdvanced();
                    $("#track_advanced").val($("#ttrym-append").prop("checked") ? $("#track_advanced").val() + result : result);
                    goSimple();
                    if ($("#ttrym-sources").prop("checked") && !$("#notes").val().includes($("#ttrym-link").val())) {
                        $("#notes").val($("#notes").val() + ($("#notes").val() == "" ? "" : "\n") + $("#ttrym-link").val());
                    };
                    $("#ttrym-link").val("");

                    parent.append("<p id='ttrym-success' style='color:green'>Successfully imported " + amount + " tracks.</p>");
                    $("#ttrym-info").remove();

                },
                onerror: () => {
                    parent.append("<p id='ttrym-error' style='color:red'>" + response.responseText + "</p>");
                    $("#ttrym-info").remove();
                }
            });

        } catch (e) {

            parent.append("<p id='ttrym-error' style='color:red'>" + e.toString() + "</p>");
            $("#ttrym-info").remove();

        };

    });

})();
