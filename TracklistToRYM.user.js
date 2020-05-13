// ==UserScript==
// @name         TracklistToRYM
// @namespace    https://github.com/TheLastZombie/
// @version      1.2.0
// @description  Imports an album's tracklist from various sources into Rate Your Music.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/TracklistToRYM.user.js
// @author       TheLastZombie
// @match        https://rateyourmusic.com/releases/ac
// @match        https://rateyourmusic.com/releases/ac?*
// @grant        none
// ==/UserScript==

(function() {

    const parent = $("input[value='Copy Tracks']").parent();
    parent.width(381);
    parent.append(`<br><br>Or import tracklists from other sources using TracklistToRYM.<p style="display:flex"><select id="ttrym-site">
        <option value="apple">Apple Music</option>
        <option value="bandcamp">Bandcamp</option>
        <option value="discogs">Discogs</option>
    </select><input id="ttrym-link" placeholder="Album URL" style="flex:1"></input><button id="ttrym-submit">Import</button></p>`);

    $("#ttrym-site").bind("change", function () {
        if ($(this).val() == "apple") $("#ttrym-link").attr("placeholder", "https://music.apple.com/album/*");
        if ($(this).val() == "bandcamp") $("#ttrym-link").attr("placeholder", "https://*.bandcamp.com/album/*");
        if ($(this).val() == "discogs") $("#ttrym-link").attr("placeholder", "https://discogs.com/release/*");
    });
    $("#ttrym-site").trigger("change");

    $("#ttrym-submit").click(function() {
        $("#ttrym-success, #ttrym-warning, #ttrym-error").remove();
        if (!$("#ttrym-link").val()) return parent.append(`<p id="ttrym-error" style="color:red">No URL specified! Please enter one and try again.</p>`);
        parent.append(`<p id="ttrym-info" style="color:#777">Importing, please wait...</p>`);
        try {

            const site = $("#ttrym-site").val();
            const link = "https://cors-anywhere.herokuapp.com/" + $("#ttrym-link").val();

            fetch(link).then((response) => {
                return response.text();
            }).then((data) => {
                var result = "";
                var amount = 0;

                if (site == "apple") {
                    $(data).find(".row.song").each(function(i) {
                        amount++;
                        var index = $(this).find(".song-index .column-data").text().trim();
                        var title = $(this).find(".song-name").text().trim();
                        var length = $(this).find(".time-data").text();
                        result += index + "|" + title + "|" + length + "\n";
                    });
                };

                if (site == "bandcamp") {
                    $(data).find(".title-col").each(function(i) {
                        amount++;
                        var index = i + 1;
                        var title = $(this).find(".track-title").text();
                        var length = $(this).find(".time").text().trim();
                        result += index + "|" + title + "|" + length + "\n";
                    });
                };

                if (site == "discogs") {
                    $(data).find(".tracklist_track").each(function(i) {
                        amount++;
                        var index = $(this).find(".tracklist_track_pos").text();
                        var title = $(this).find(".tracklist_track_title > span").text();
                        var length = $(this).find(".tracklist_track_duration span").text().trim();
                        result += index + "|" + title + "|" + length + "\n";
                    });
                };

                if (amount == 0) return parent.append(`<p id="ttrym-warning" style="color:orange">Did not find any tracks. Please check your URL and try again.</p>`);
                goAdvanced();
                $("#track_advanced").val(result);
                // TODO: Clear input?
                goSimple();
                parent.append(`<p id="ttrym-success" style="color:green">Successfully imported ` + amount + ` tracks.</p>`);
            }).catch((error) => {
                parent.append(`<p id="ttrym-error" style="color:red">` + error.toString() + `</p>`);
            }).finally(() => {
                $("#ttrym-info").remove();
            });

        } catch(e) {
            parent.append(`<p id="ttrym-error" style="color:red">` + e.toString() + `</p>`);
            $("#ttrym-info").remove();
        };
    });

})();
