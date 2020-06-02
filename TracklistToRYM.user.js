// ==UserScript==
// @name           TracklistToRYM
// @namespace      https://github.com/TheLastZombie/
// @version        1.3.3
// @description    Imports an album's tracklist from various sources into Rate Your Music.
// @description:de Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/TracklistToRYM.user.js
// @author         TheLastZombie
// @match          https://rateyourmusic.com/releases/ac
// @match          https://rateyourmusic.com/releases/ac?*
// @grant          none
// @icon           https://e.snmc.io/2.5/img/sonemic.png
// ==/UserScript==

(function () {

    const parent = $("input[value='Copy Tracks']").parent();

    const sites = [
        {
            id: "apple",
            name: "Apple Music",
            placeholder: "https://music.apple.com/album/*",
            parent: ".row.song",
            index: ".song-index .column-data",
            title: ".song-name",
            length: ".time-data"
        },
        {
            id: "bandcamp",
            name: "Bandcamp",
            placeholder: "https://*.bandcamp.com/album/*",
            parent: ".title-col",
            index: false,
            title: ".track-title",
            length: ".time"
        },
        {
            id: "deezer",
            name: "Deezer",
            placeholder: "https://deezer.com/album/*",
            parent: ".song",
            index: ".number",
            title: "[itemprop='name']",
            length: ".timestamp"
        },
        {
            id: "discogs",
            name: "Discogs",
            placeholder: "https://discogs.com/release/*",
            parent: ".tracklist_track:not(.track_heading)",
            index: ".tracklist_track_pos",
            title: ".tracklist_track_title > span",
            length: ".tracklist_track_duration span"
        },
        {
            id: "genius",
            name: "Genius",
            placeholder: "https://genius.com/albums/*/*",
            parent: ".chart_row",
            index: "chart_row-number_container-number",
            title: ".chart_row-content-title",
            length: false
        },
        {
            id: "musicbrainz",
            name: "MusicBrainz",
            placeholder: "https://musicbrainz.org/release/*",
            parent: "#content tr.odd, #content tr.even",
            index: "td.pos",
            title: "td > a bdi, td .name-variation > a bdi",
            length: "td.treleases"
        }
    ];

    parent.width(381);
    parent.append("<br><br>Or import tracklists from other sources using TracklistToRYM.<p style='display:flex'><select id='ttrym-site'>"
        + sites.map(x => "<option value='" + x.id + "'>" + x.name + "</option>").join("")
        + "</select><input id='ttrym-link' placeholder='Album URL' style='flex:1'></input><button id='ttrym-submit'>Import</button></p>"
        + "<p><input id='ttrym-sources' name='ttrym-sources' type='checkbox' checked><label for='ttrym-sources'> Add URL to sources </label>"
        + "<input id='ttrym-append' name='ttrym-append' type='checkbox'><label for='ttrym-append'> Append instead of replace </label></p>");

    $("#ttrym-site").bind("change", function () {
        $("#ttrym-link").attr("placeholder", sites.filter(x => x.id == $(this).val())[0].placeholder);
    });
    $("#ttrym-site").trigger("change");

    $("#ttrym-submit").click(function () {

        $("#ttrym-success, #ttrym-warning, #ttrym-error").remove();
        if (!$("#ttrym-link").val()) return parent.append("<p id='ttrym-error' style='color:red'>No URL specified! Please enter one and try again.</p>");
        parent.append("<p id='ttrym-info' style='color:#777'>Importing, please wait...</p>");

        try {

            const site = $("#ttrym-site").val();
            const input = sites.filter(x => x.id == site)[0];
            const link = "https://cors-anywhere.herokuapp.com/" + $("#ttrym-link").val();

            fetch(link).then((response) => {
                return response.text();
            }).then((data) => {

                var result = "";
                var amount = 0;

                $(data).find(input.parent).each(function (i) {
                    amount++;
                    var index = $(this).find(input.index).children().remove().end().text().trim().replace(/^0+/, "") || i + 1;
                    var title = $(this).find(input.title).children().remove().end().text().trim() || "";
                    var length = $(this).find(input.length).children().remove().end().text().trim() || "";
                    result += index + "|" + title + "|" + length + "\n";
                });

                if (amount == 0) return parent.append("<p id='ttrym-warning' style='color:orange'>Did not find any tracks. Please check your URL and try again.</p>");

                goAdvanced();
                $("#track_advanced").val($("#ttrym-append").prop("checked") ? $("#track_advanced").val() + result : result);
                goSimple();
                if ($("#ttrym-sources").prop("checked") && !$("#notes").val().includes($("#ttrym-link").val())) {
                    $("#notes").val($("#notes").val() + ($("#notes").val() == "" ? "" : "\n") + $("#ttrym-link").val());
                };
                $("#ttrym-link").val("");

                parent.append("<p id='ttrym-success' style='color:green'>Successfully imported " + amount + " tracks.</p>");

            }).catch((error) => {
                parent.append("<p id='ttrym-error' style='color:red'>" + error.toString() + "</p>");
            }).finally(() => {
                $("#ttrym-info").remove();
            });

        } catch (e) {

            parent.append("<p id='ttrym-error' style='color:red'>" + e.toString() + "</p>");
            $("#ttrym-info").remove();

        };

    });

})();
