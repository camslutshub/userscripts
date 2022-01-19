// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */
/* globals deleteFiledUnder, goAdvanced, goSimple */

// ==UserScript==
// @name            TracklistToRYM
// @name:de         TracklistToRYM
// @name:en         TracklistToRYM
// @namespace       https://github.com/TheLastZombie/
// @version         1.22.3
// @description     Imports an album's tracklist from various sources into Rate Your Music.
// @description:de  Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @description:en  Imports an album's tracklist from various sources into Rate Your Music.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=TracklistToRYM
// @contributionURL https://ko-fi.com/rcrsch
// @downloadURL     https://raw.github.com/TheLastZombie/userscripts/master/user/TracklistToRYM.user.js
// @updateURL       https://raw.github.com/TheLastZombie/userscripts/master/meta/TracklistToRYM.meta.js
// @author          TheLastZombie <roesch.eric@protonmail.com>
// @match           https://rateyourmusic.com/releases/ac
// @match           https://rateyourmusic.com/releases/ac?*
// @connect         allmusic.com
// @connect         amazon.com
// @connect         apple.com
// @connect         pulsewidth.org.uk
// @connect         bandcamp.com
// @connect         beatport.com
// @connect         deezer.com
// @connect         discogs.com
// @connect         freemusicarchive.org
// @connect         genius.com
// @connect         archive.org
// @connect         junodownload.com
// @connect         khinsider.com
// @connect         last.fm
// @connect         loot.co.za
// @connect         metal-archives.com
// @connect         musicbrainz.org
// @connect         musik-sammler.de
// @connect         napster.com
// @connect         naxos.com
// @connect         rateyourmusic.com
// @connect         sonemic.com
// @connect         streetvoice.com
// @connect         qobuz.com
// @connect         vgmdb.net
// @connect         vinyl-digital.com
// @connect         youtube.com
// @connect         *
// @grant           GM.deleteValue
// @grant           GM_deleteValue
// @grant           GM.getValue
// @grant           GM_getValue
// @grant           GM.listValues
// @grant           GM_listValues
// @grant           GM.setValue
// @grant           GM_setValue
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/TracklistToRYM.png
// @copyright       2020-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(async function () {
  const parent = document.querySelector("input[value='Copy Tracks']").parentNode
  let msgPosted = false

  const sitestmp = [
    {
      name: 'AllMusic',
      extractor: 'node',
      placeholder: 'https://www.allmusic.com/album/*',
      artist: '.album-artist a',
      album: '.album-title',
      parent: '.track',
      index: '.tracknum',
      title: '.title a',
      length: '.time'
    },
    {
      name: 'Amazon',
      extractor: 'node',
      placeholder: 'https://www.amazon.com/dp/*',
      artist: '#ProductInfoArtistLink',
      album: 'h1',
      parent: '#dmusic_tracklist_content tbody > .a-text-left',
      index: 'div.TrackNumber-Default-Color',
      title: '.TitleLink',
      length: '.a-size-base-plus.a-color-secondary'
    },
    {
      name: 'Apple Music',
      extractor: 'node',
      placeholder: 'https://music.apple.com/*/album/*',
      artist: '.product-creator a',
      album: 'h1',
      parent: '.songs-list-row--song',
      index: '.songs-list-row__column-data',
      title: '.songs-list-row__song-name',
      length: '.songs-list-row__length'
    },
    {
      name: 'a-tisket',
      extractor: 'node',
      placeholder: 'https://atisket.pulsewidth.org.uk/*',
      artist: '.artist',
      album: '.album-title cite',
      parent: '.track',
      index: '.track-num',
      title: '.track-name',
      length: '.duration'
    },
    {
      name: 'Bandcamp',
      extractor: 'node',
      placeholder: 'https://*.bandcamp.com/album/*',
      artist: '#name-section h3 a',
      album: 'h2',
      parent: '.title-col',
      index: false,
      title: '.track-title',
      length: '.time'
    },
    {
      name: 'Beatport',
      extractor: 'node',
      placeholder: 'https://www.beatport.com/release/*/*',
      artist: '.interior-release-chart-content-item--desktop [data-label]',
      album: 'h1',
      parent: '.track',
      index: '.buk-track-num',
      title: '.buk-track-primary-title',
      length: '.buk-track-length'
    },
    {
      name: 'Deezer',
      extractor: 'node',
      placeholder: 'https://deezer.com/album/*',
      artist: '#naboo_album_artist a span',
      album: '#naboo_album_title',
      parent: '.song',
      index: '.number',
      title: "[itemprop='name']",
      length: '.timestamp'
    },
    {
      name: 'Discogs',
      extractor: 'node',
      placeholder: 'https://discogs.com/release/*',
      artist: 'h1 a',
      album: 'h1',
      parent: 'tr[data-track-position]',
      index: 'td[class^=trackPos]',
      title: 'td[class^=trackTitle] span',
      length: 'td[class^=duration] span'
    },
    {
      name: 'Free Music Archive',
      extractor: 'node',
      placeholder: 'https://freemusicarchive.org/music/*/*',
      artist: '.bcrumb > a:last-of-type',
      album: 'h1',
      parent: '.play-item',
      index: '.playtxt > b',
      title: '.playtxt > a > b',
      length: '.playtxt'
    },
    {
      name: 'Genius',
      extractor: 'node',
      placeholder: 'https://genius.com/albums/*/*',
      artist: 'h2 a',
      album: 'h1',
      parent: '.chart_row',
      index: 'chart_row-number_container-number',
      title: '.chart_row-content-title',
      length: false
    },
    {
      name: 'Internet Archive',
      extractor: 'node',
      placeholder: 'https://archive.org/details/*',
      artist: '.metadata-definition span a',
      album: '.item-title .breaker-breaker',
      parent: '.related-track-row',
      index: false,
      title: '.track-title',
      length: false
    },
    {
      name: 'Juno Download',
      extractor: 'node',
      placeholder: 'https://www.junodownload.com/products/*',
      artist: '.product-artist a',
      album: 'h1',
      parent: '.product-tracklist-track',
      index: '.track-title',
      title: "[itemprop='name']",
      length: '.col-1'
    },
    {
      name: 'Kingdom Hearts Insider',
      extractor: 'node',
      placeholder: 'https://downloads.khinsider.com/game-soundtracks/album/*',
      artist: false,
      album: 'h2',
      parent: '#songlist tr:not(#songlist_header):not(#songlist_footer)',
      index: "td[style='padding-right: 8px;']",
      title: ".clickable-row:not([align='right']) a",
      length: ".clickable-row[align='right'] a"
    },
    {
      name: 'Last.fm',
      extractor: 'node',
      placeholder: 'https://www.last.fm/music/*/*',
      artist: '.header-new-crumb span',
      album: 'h1',
      parent: '.chartlist-row',
      index: '.chartlist-index',
      title: '.chartlist-name a',
      length: '.chartlist-duration'
    },
    {
      name: 'Loot.co.za',
      extractor: 'node',
      placeholder: 'https://www.loot.co.za/product/*/*',
      artist: 'h2 a',
      album: false,
      parent: '#tabs div:nth-last-child(2) .productDetails tr:not([style])',
      index: 'td[width]',
      title: 'td:not([width])',
      length: false
    },
    {
      name: 'Metal Archives',
      extractor: 'node',
      placeholder: 'https://www.metal-archives.com/albums/*/*/*',
      artist: '#album_sidebar > a',
      album: '.album_name > a',
      parent: '.table_lyrics .even, .table_lyrics .odd',
      index: 'td',
      title: '.wrapWords',
      length: "td[align='right']"
    },
    {
      name: 'MusicBrainz',
      extractor: 'node',
      placeholder: 'https://musicbrainz.org/release/*',
      artist: '.subheader bdi',
      album: '.releaseheader bdi',
      parent: '#content tr.odd, #content tr.even',
      index: 'td.pos a',
      title: 'td > a bdi, td .name-variation > a bdi',
      length: 'td.treleases'
    },
    {
      name: 'Musik-Sammler',
      extractor: 'node',
      placeholder: 'https://www.musik-sammler.de/release/*',
      artist: '.header-span a',
      album: "h1 span[itemprop='name']",
      parent: "[itemprop='track'] tbody tr",
      index: '.track-position',
      title: '.track-title span',
      length: '.track-time'
    },
    {
      name: 'Napster',
      extractor: 'node',
      placeholder: 'https://napster.com/artist/*/album/*',
      artist: '.show-for-medium .artist-link',
      album: '#page-name',
      parent: '.track-item',
      index: '.track-number div',
      title: '.track-title',
      length: false
    },
    {
      name: 'Naxos Records',
      extractor: 'node',
      placeholder: 'https://www.naxos.com/catalogue/item.asp?item_code=*',
      artist: '.composers a',
      album: false,
      parent: "table[valign='top']",
      index: 'td:first-child',
      title: 'td:nth-child(4) b',
      length: 'td:nth-child(4)'
    },
    {
      name: 'Qobuz',
      extractor: 'node',
      placeholder: 'https://www.qobuz.com/*/album/*/*',
      artist: '.album-meta__artist',
      album: '.album-meta__title',
      parent: '.track',
      index: '.track__item--number span',
      title: '.track__item--name span',
      length: '.track__item--duration'
    },
    {
      name: 'Rate Your Music',
      extractor: 'node',
      placeholder: 'https://rateyourmusic.com/release/album/*/*',
      artist: '.album_artist_small a',
      album: '.album_title',
      parent: "#tracks .track:not([style='text-align:right;'])",
      index: '.tracklist_num',
      title: "[itemprop='name'] .rendered_text",
      length: '.tracklist_duration'
    },
    {
      name: 'Sonemic',
      extractor: 'node',
      placeholder: 'https://sonemic.com/release/album/*/*',
      artist: '#page_object_header .music_artist',
      album: '.page_object_header_title',
      parent: '.page_fragment_track_track',
      index: '.page_fragment_track_num',
      title: '.page_fragment_track_title .song',
      length: '.page_fragment_track_duration'
    },
    {
      name: 'StreetVoice',
      extractor: 'node',
      placeholder: 'https://streetvoice.com/*/songs/album/*',
      artist: '.user-info a',
      album: 'h1',
      parent: '#item_box_list > li',
      index: '.work-item-number h4',
      title: '.work-item-info h4 a',
      length: false
    },
    {
      name: 'VGMdb',
      extractor: 'node',
      placeholder: 'https://vgmdb.net/album/*',
      artist: "td .artistname[style='display:inline']:not([title='Composer'])",
      album: "h1 .albumtitle[lang='en']",
      parent: '.tl:first-child .rolebit',
      index: '.label',
      title: "[colspan='2']",
      length: '.time'
    },
    {
      name: 'Vinyl Digital',
      extractor: 'node',
      placeholder: 'https://vinyl-digital.com/*/*',
      artist: '#test_othersartist',
      album: '#test_product_name',
      parent: '#playlist_table tr:not(:first-child):not([style])',
      index: '.track',
      title: '.tracktitle span',
      length: 'td:not([class])'
    },
    {
      name: 'YouTube Music',
      extractor: 'regex',
      placeholder: 'https://music.youtube.com/playlist?list=*',
      artist: /(?<=\\"musicArtist\\".*?\\"name\\":\\").*?(?=\\",)/g,
      album: /(?<=\\"musicAlbumRelease\\".*?\\"title\\":\\").*?(?=\\",)/g,
      parent: /{\\"musicTrack\\":.*?}}}},/g,
      index: /(?<=\\"albumTrackIndex\\":\\").*?(?=\\",)/,
      title: /(?<=\\"title\\":\\").*?(?=\\",)/,
      length: false
    }
  ]

  if (localStorage.getItem('ttrym-sites')) {
    await GM.setValue('sites', localStorage.getItem('ttrym-sites').split(','))
    await GM.setValue('default', localStorage.getItem('ttrym-sites').split(',').sort()[0])
    localStorage.removeItem('ttrym-sites')
  }

  if (await GM.getValue('artist') === undefined) await GM.setValue('artist', false)
  if (await GM.getValue('release') === undefined) await GM.setValue('release', false)
  if (await GM.getValue('sites') === undefined) await GM.setValue('sites', sitestmp.map(x => x.name))
  if (await GM.getValue('default') === undefined || !(await GM.getValue('sites')).includes(await GM.getValue('default'))) await GM.setValue('default', 'Rate Your Music')
  if (await GM.getValue('guess') === undefined) await GM.setValue('guess', true)
  if (await GM.getValue('append') === undefined) await GM.setValue('append', false)
  if (await GM.getValue('sources') === undefined) await GM.setValue('sources', true)

  const asyncFilterHelper = await GM.getValue('sites')
  const sites = sitestmp.filter(x => asyncFilterHelper.includes(x.name))

  parent.style.width = '500px'
  parent.insertAdjacentHTML('beforeend', "<br><hr style='margin-top:1em;margin-bottom:1em;border:none;height:1px;background:var(--mono-d);width:calc(100% + 20px);position:relative;left:-10px'>" +
    "<p style='display:flex;margin-bottom:0'><a href='https://github.com/TheLastZombie/userscripts#tracklisttorym-' target='_blank' style='position:relative;top:3px;color:inherit'>TTRYM</a>" +
    "<select id='ttrym-site' style='max-width:0;margin-left:.5em;border-radius:3px 0 0 3px'>" + sites.map(x => "<option value='" + x.name + "'>" + x.name + '</option>').join('') + '</select>' +
    "<input id='ttrym-link' placeholder='Album URL' style='flex:1;border-left:none;border-radius:0 3px 3px 0;padding-left:5px'></input>" +
    "<button id='ttrym-submit' style='font-family:\"Font Awesome 5 Free\";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Import'>&#xf00c;</button>" +
    "<button id='ttrym-settings' style='font-family:\"Font Awesome 5 Free\";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Settings'>&#xf013;</button></p>")

  document.getElementById('ttrym-site').addEventListener('change', function () {
    document.getElementById('ttrym-link').placeholder = sites.filter(x => x.name === this.value)[0].placeholder
  })
  document.getElementById('ttrym-site').value = await GM.getValue('default')
  document.getElementById('ttrym-site').dispatchEvent(new Event('change'))

  document.addEventListener('click', function (e) {
    if (e.target?.id === 'ttrym-dismiss') clearMessages()
  })

  document.getElementById('ttrym-submit').addEventListener('click', async function () {
    clearMessages()
    if (!document.getElementById('ttrym-link').value) return printMessage('error', 'No URL specified! Please enter one and try again.')
    printMessage('progress', 'Importing, please wait...')
    document.getElementById('ttrym-submit').disabled = true

    document.querySelectorAll('.filed_under_delete a').forEach(element => {
      deleteFiledUnder(Number(element.href.match(/\d+/)))
    })

    try {
      const site = document.getElementById('ttrym-site').value
      let input = sites.filter(x => x.name === site)[0]
      let link = document.getElementById('ttrym-link').value

      link = input.transformer ? input.transformer(link) : link
      if (!link.match(/^https?:\/\//)) link = 'https://' + link

      if (!globToRegex(input.placeholder).test(link)) {
        const suggestion = sites.filter(x => globToRegex(x.placeholder).test(link))[0]
        if (suggestion && await GM.getValue('guess')) {
          printMessage('progress', 'Using ' + suggestion.name + ' instead of ' + input.name + '.')
          input = suggestion
          document.getElementById('ttrym-site').value = input.name
        } else {
          printMessage('warning', "Entered URL does not match the selected site's placeholder. Request may not succeed.")
        }
      }

      GM.xmlHttpRequest({
        method: 'GET',
        url: link,
        onload: async (response) => {
          const data = response.responseText

          let artist = ''
          let album = ''
          let result = ''
          let amount = 0

          switch (input.extractor) {
            case 'json':
              JSON.parse(data).forEach(element => {
                amount++
                const index = input.index ? reduceJson(element[input.parent], input.index) : amount
                const title = input.title ? reduceJson(element[input.parent], input.title) : ''
                const length = input.length ? reduceJson(element[input.parent], input.length) : ''
                result += getResult(index, title, length)
              })
              artist = input.artist ? reduceJson(JSON.parse(data)[input.parent], input.artist) : ''
              album = input.album ? reduceJson(JSON.parse(data)[input.parent], input.album) : ''
              break

            case 'node':
              new DOMParser().parseFromString(data, 'text/html').querySelectorAll(input.parent).forEach(element => {
                amount++
                const index = parseNode(element.querySelector(input.index)) || amount
                const title = parseNode(element.querySelector(input.title)) || ''
                const length = parseNode(element.querySelector(input.length)) || ''
                result += getResult(index, title, length)
              })
              artist = parseNode(new DOMParser().parseFromString(data, 'text/html').querySelector(input.artist)) || ''
              album = parseNode(new DOMParser().parseFromString(data, 'text/html').querySelector(input.album)) || ''
              break

            case 'regex':
              data.match(input.parent).forEach(function (i) {
                amount++
                const index = input.index ? i.match(input.index)[0].toString() : amount
                const title = input.title ? i.match(input.title)[0] : ''
                const length = input.length ? i.match(input.length)[0] : ''
                result += getResult(index, title, length)
              })
              artist = input.artist ? data.match(input.artist)[0] : ''
              album = input.album ? data.match(input.album)[0] : ''
              break

            default:
              document.getElementById('ttrym-submit').disabled = false
              return printMessage('error', input.extractor + " is not a valid extractor. This is (probably) not your fault, please report this on <a href='https://github.com/TheLastZombie/userscripts/issues/new?title=" + input.extractor + "%20is%20not%20a%20valid%20extractor&labels=TracklistToRYM'>GitHub</a>.")
          }

          if (amount === 0) {
            document.getElementById('ttrym-submit').disabled = false
            return printMessage('warning', 'Did not find any tracks. Please check your URL and try again.')
          }

          artist = parseArtist(artist)
          album = parseAlbum(album)

          if (await GM.getValue('artist')) {
            GM.xmlHttpRequest({
              method: 'GET',
              url: 'https://rateyourmusic.com/go/searchcredits?target=filedunder&searchterm=' + artist,
              onload: async (response) => {
                // eslint-disable-next-line no-eval
                eval(new DOMParser().parseFromString(response.responseText, 'text/html').getElementsByClassName('result')[0].getAttribute('onClick').replace('window.parent.', '')) // jshint ignore:line
              }
            })
          }
          if (await GM.getValue('release')) document.getElementById('title').value = album

          goAdvanced()
          document.getElementById('track_advanced').value = await GM.getValue('append') ? document.getElementById('track_advanced').value + result : result
          goSimple()

          if (await GM.getValue('sources') && !document.getElementById('notes').value.includes(document.getElementById('ttrym-link').value)) {
            document.getElementById('notes').value = document.getElementById('notes').value + (document.getElementById('notes').value === '' ? '' : '\n') + document.getElementById('ttrym-link').value
          }
          document.getElementById('ttrym-link').value = ''

          document.getElementById('ttrym-submit').disabled = false
          printMessage('success', 'Imported ' + amount + ' tracks.')
        },

        onerror: (response) => {
          document.getElementById('ttrym-submit').disabled = false
          printMessage('error', response.responseText)
        }
      })
    } catch (e) {
      document.getElementById('ttrym-submit').disabled = false
      printMessage('error', e.toString())
    }
  })

  document.getElementById('ttrym-settings').addEventListener('click', async function () {
    document.body.style.overflow = 'hidden'

    document.body.insertAdjacentHTML('beforeend', "<div id='ttrym-settings-wrapper' style='box-sizing:border-box;width:100vw;height:100vh;position:fixed;top:45px;background:rgba(255,255,255,0.75);padding:50px;z-index:80'>" +
      "<div class='submit_step_box' style='padding:25px;height:calc(100% - 50px);overflow:auto'><span class='submit_step_header' style='margin:0!important'>" +
      "TracklistToRYM: <span class='submit_step_header_title'>Settings</span></span>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Supply additional data</b><br>" +
      "While TracklistToRYM's main goal is to fill in tracklists, it can also enter additional metadata.<br>" +
      'Keep in mind that if enabled and used, any previously input data will be replaced.</p>' +
      "<input id='ttrym-artist' name='ttrym-artist' type='checkbox' style='margin-bottom:.25em'></input><label for='ttrym-artist' style='position:relative;bottom:1px'> Artist name <span style='opacity:0.5;font-weight:lighter'>Step 1.3 (“File under”)</span></label><br>" +
      "<input id='ttrym-release' name='ttrym-release' type='checkbox' style='margin-bottom:.25em'></input><label for='ttrym-release' style='position:relative;bottom:1px'> Release title <span style='opacity:0.5;font-weight:lighter'>Step 2.1 (“Title”)</span></label>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Manage sites</b><br>" +
      'Choose which sites to show and which ones to hide in the TracklistToRYM selection box.<br>' +
      "Note that newly added sites are disabled by default, so you may want to check this dialog when there's been an update.</p>" +
      sitestmp.map(x => "<input type='checkbox' style='margin-bottom:.25em' class='ttrym-checkbox' id='ttrym-site-" + x.name.replace(/\s/g, '') + "' name='" + x.name + "'><label for='ttrym-site-" + x.name.replace(/\s/g, '') + "' style='position:relative;bottom:1px'> " + x.name + " <span style='opacity:0.5;font-weight:lighter'>" + x.placeholder + '</span></label><br>').join('') +
      "<div style='margin-top:15px'><button id='ttrym-enable'>Enable all sites</button><button id='ttrym-invert' style='margin-left:10px'>Invert selection</button><button id='ttrym-disable' style='margin-left:10px'>Disable all sites</button></div>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Set default site</b><br>" +
      'Choose which site should be selected by default; you may choose the site that you use the most.<br>' +
      "If the chosen site isn't already, it will be enabled automatically.</p>" +
      "<select id='ttrym-default'>" + sitestmp.map(x => "<option value='" + x.name + "'>" + x.name + '</option>').join('') + '</select>' +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Auto-select sites</b><br>" +
      'Select whether to guess sites from their URL and automatically select them.<br>' +
      'This has been the default behavior since version 1.10.0.</p>' +
      "<input id='ttrym-change' name='ttrym-change' type='checkbox' style='margin-bottom:.25em'></input><label for='ttrym-change' style='position:relative;bottom:1px'> Guess and automatically select sites</label>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Append instead of replace</b><br>" +
      'Enabling this will allow you to combine multiple releases into one by keeping previous tracks when inserting new ones.</p>' +
      "<input id='ttrym-append' name='ttrym-append' type='checkbox' style='margin-bottom:.25em'></input><label for='ttrym-append' style='position:relative;bottom:1px'> Append tracks to list</label>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      "<p><b class='submit_field_header' style='display:block;margin-bottom:-1em'>Add URL to sources</b><br>" +
      'Select whether to automatically add the entered URL to the submission sources in step five.<br>' +
      'This has been the default behavior since version 1.3.0.</p>' +
      "<input id='ttrym-sources' name='ttrym-sources' type='checkbox' style='margin-bottom:.25em'></input><label for='ttrym-sources' style='position:relative;bottom:1px'> Automatically add URLs to sources</label>" +
      "<div class='submit_field_header_separator' style='margin-top:15px;margin-bottom:15px'></div>" +
      '<p>FYI: You can also directly edit these settings in your userscript manager:</p>' +
      '<p><b>Tampermonkey:</b> Dashboard → Installed userscripts → TracklistToRYM → Edit → Storage<br>' +
      '<b>Violentmonkey:</b> Open Dashboard → Installed scripts → TracklistToRYM → Edit → Values</p>' +
      "<div style='margin-bottom:25px'><button id='ttrym-save'>Save and reload page</button><button id='ttrym-discard' style='margin-left:10px'>Close window without saving</button><button id='ttrym-reset' style='margin-left:10px'>Reset and reload page</button></div>" +
      '</div></div>')

    document.getElementById('ttrym-artist').checked = await GM.getValue('artist')
    document.getElementById('ttrym-release').checked = await GM.getValue('release')
    Array.from(document.getElementsByClassName('ttrym-checkbox')).forEach(element => {
      if (sites.map(x => x.name).includes(element.name)) element.checked = true
    })
    document.getElementById('ttrym-default').value = await GM.getValue('default')
    document.getElementById('ttrym-change').checked = await GM.getValue('guess')
    document.getElementById('ttrym-append').checked = await GM.getValue('append')
    document.getElementById('ttrym-sources').checked = await GM.getValue('sources')

    document.getElementById('ttrym-enable').addEventListener('click', function () {
      Array.from(document.getElementsByClassName('ttrym-checkbox')).forEach(element => {
        element.checked = true
      })
    })

    document.getElementById('ttrym-invert').addEventListener('click', function () {
      Array.from(document.getElementsByClassName('ttrym-checkbox')).forEach(element => {
        element.checked = !element.checked
      })
    })

    document.getElementById('ttrym-disable').addEventListener('click', function () {
      Array.from(document.getElementsByClassName('ttrym-checkbox')).forEach(element => {
        element.checked = false
      })
    })

    document.getElementById('ttrym-reset').addEventListener('click', async function () {
      if (confirm('Do you really want to reset all preferences?')) {
        (await GM.listValues()).forEach(async setting => await GM.deleteValue(setting))
        location.reload()
      }
    })

    document.getElementById('ttrym-save').addEventListener('click', async function () {
      const sites = Array.from(document.querySelectorAll('.ttrym-checkbox:checked')).map(x => x.name)

      await GM.setValue('artist', document.getElementById('ttrym-artist').checked)
      await GM.setValue('release', document.getElementById('ttrym-release').checked)
      await GM.setValue('sites', sites)
      await GM.setValue('default', document.getElementById('ttrym-default').value)
      await GM.setValue('guess', document.getElementById('ttrym-change').checked)
      await GM.setValue('append', document.getElementById('ttrym-append').checked)
      await GM.setValue('sources', document.getElementById('ttrym-sources').checked)

      if (!sites.includes(document.getElementById('ttrym-default').value)) await GM.setValue('sites', sites.concat(document.getElementById('ttrym-default').value))

      location.reload()
    })

    document.getElementById('ttrym-discard').addEventListener('click', function () {
      document.body.style.overflow = 'initial'
      document.getElementById('ttrym-settings-wrapper').parentNode.removeChild(document.getElementById('ttrym-settings-wrapper'))
    })
  })

  function clearMessages (levels) {
    if (!levels) levels = ['progress', 'success', 'warning', 'error']
    if (!Array.isArray(levels)) levels = [levels]
    document.querySelectorAll(levels.map(x => '#ttrym-' + x).join(',')).forEach(x => x.parentNode.removeChild(x))
    msgPosted = false
    if (document.getElementById('ttrym-dismiss')) document.getElementById('ttrym-dismiss').parentNode.removeChild(document.getElementById('ttrym-dismiss'))
  }

  function getResult (index, title, length) {
    return parseIndex(index) + '|' + parseTitle(title) + '|' + parseLength(length) + '\n'
  }

  function globToRegex (glob) {
    return new RegExp(glob.replace(/[.+\-?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'))
  }

  function parseAlbum (album) {
    return album.trim().replace(/^–\s/, '')
  }

  function parseArtist (artist) {
    return artist.trim()
  }

  function parseIndex (index) {
    return index.toString().trim().replace(/^0+/, '').replace(/\.$/, '')
  }

  function parseLength (length) {
    if (length === '?:??') return ''
    let matches = length.match(/(\d+:)+\d+/)
    if (matches) {
      matches = matches[0].replace(/^(0+:?)+/, '')
      if (!matches.includes(':')) {
        if (matches < 10) matches = '0' + matches
        matches = '0:' + matches
      }
      matches = matches.replace(/\..*/, '')
      return matches
    }
    return length
  }

  function parseNode (node) {
    return node ? node.firstChild.nodeValue : ''
  }

  function parseTitle (title) {
    return title.trim().replace(/(& {2})?(- )/, '')
  }

  function printMessage (level, message) {
    const colors = {
      progress: '#777',
      success: 'green',
      warning: 'orange',
      error: 'red'
    }
    parent.insertAdjacentHTML('beforeend', "<p id='ttrym-" + level + "' style='color:" + colors[level] + ';' + (msgPosted ? '' : 'margin-top:.5em;') + "margin-bottom:0'>" + level.charAt(0).toUpperCase() + level.slice(1) + ': ' + message + '</p>')
    msgPosted = true
    if (!document.getElementById('ttrym-dismiss')) document.getElementById('ttrym-settings').insertAdjacentHTML('beforebegin', "<button id='ttrym-dismiss' style='font-family:\"Font Awesome 5 Free\";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Dismiss'>&#xf0c9;</button>")
  }

  function reduceJson (object, path) {
    return path.split('.').reduce((acc, cur) => acc[cur], object)
  }
})()

// @license-end
