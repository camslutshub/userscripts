// ==UserScript==
// @name         TracklistToRYM
// @namespace    https://github.com/TheLastZombie/
// @version      1.0.0
// @description  Imports an album's tracklist from various sources into Rate Your Music.
// @downloadURL  https://raw.github.com/TheLastZombie/userscripts/master/TracklistToRYM.user.js
// @author       TheLastZombie
// @match        https://rateyourmusic.com/releases/ac
// @match        https://rateyourmusic.com/releases/ac?*
// @grant        none
// ==/UserScript==

(function() {

    const parent = $("div[style='position:absolute;right:3%;width:300px;padding:10px;border:1px #ddd solid;background:#f8f8f8;z-index:80;']");
    parent.append(`<br><br>Or import tracklists from other sources using TracklistToRYM.<p style="display:flex"><select id="ttrym-site">
        <option value="bandcamp">Bandcamp</option>
        <option value="discogs">Discogs</option>
    </select><input id="ttrym-link" placeholder="Album URL"></input><button id="ttrym-submit">Import</button></p>`);

    $("#ttrym-submit").click(function() {
        $("#ttrym-error").remove();
        try {

            const site = $("#ttrym-site").val();
            const link = "https://cors-anywhere.herokuapp.com/" + $("#ttrym-link").val();

            fetch(link).then((response) => {
                return response.text();
            }).then((data) => {
                var result = "";

                if (site == "bandcamp") {
                    $(data).find(".title-col").each(function(i) {
                        var index = i + 1;
                        var title = $(this).find(".track-title").text();
                        var length = $(this).find(".time").text().trim();
                        result += index + "|" + title + "|" + length + "\n";
                    });
                };

                if (site == "discogs") {
                    $(data).find(".tracklist_track").each(function(i) {
                        var index = $(this).find(".tracklist_track_pos").text();
                        var title = $(this).find(".tracklist_track_title span").text();
                        var length = $(this).find(".tracklist_track_duration span").text().trim();
                        result += index + "|" + title + "|" + length + "\n";
                    });
                };

                goAdvanced();
                $("#track_advanced").val(result);
                // TODO: Clear input?
                goSimple();
            });

        } catch(e) {
            parent.append(`<p id="ttrym-error" style="color:red">` + e.toString() + `</p>`);
        };
    });

})();
