// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           TracklistToRYM
// @namespace      https://github.com/TheLastZombie/
// @version        1.11.0
// @description    Imports an album's tracklist from various sources into Rate Your Music.
// @description:de Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @homepageURL    https://github.com/TheLastZombie/userscripts/
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=TracklistToRYM
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/TracklistToRYM.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/TracklistToRYM.meta.js
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
// @connect        vinyl-digital.com
// @connect        youtube.com
// @connect        *
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/TracklistToRYM.png
// @license        MIT
// ==/UserScript==

(function () {
  const parent = $("input[value='Copy Tracks']").parent()

  const sitestmp = [
    {
      name: 'AllMusic',
      extractor: 'node',
      placeholder: 'https://www.allmusic.com/album/*',
      parent: '.track',
      index: '.tracknum',
      title: '.title a',
      length: '.time'
    },
    {
      name: 'Amazon',
      extractor: 'node',
      placeholder: 'https://www.amazon.com/dp/*',
      parent: '#dmusic_tracklist_content .a-text-left',
      index: '.TrackNumber-Default-Color',
      title: '.TitleLink',
      length: '.a-size-small.a-color-secondary'
    },
    {
      name: 'Apple Music',
      extractor: 'node',
      placeholder: 'https://music.apple.com/*/album/*',
      parent: '.row.song',
      index: '.song-index .column-data',
      title: '.song-name',
      length: '.time-data'
    },
    {
      name: 'Bandcamp',
      extractor: 'node',
      placeholder: 'https://*.bandcamp.com/album/*',
      parent: '.title-col',
      index: false,
      title: '.track-title',
      length: '.time'
    },
    {
      name: 'Beatport',
      extractor: 'node',
      placeholder: 'https://www.beatport.com/release/*/*',
      parent: '.track',
      index: '.buk-track-num',
      title: '.buk-track-primary-title',
      length: '.buk-track-length'
    },
    {
      name: 'Beatport Classic',
      extractor: 'node',
      placeholder: 'http://classic.beatport.com/release/*/*',
      parent: '.track-grid-content',
      index: '.playColumn .artWrapper',
      title: '.titleColumn .txt-larger > span:not(.txt-grey)',
      length: 'td:not(.playColumn):not(.titleColumn):not(.cartColumn) span:not(.genreList)'
    },
    {
      name: 'Deezer',
      extractor: 'node',
      placeholder: 'https://deezer.com/album/*',
      parent: '.song',
      index: '.number',
      title: "[itemprop='name']",
      length: '.timestamp'
    },
    {
      name: 'Discogs',
      extractor: 'node',
      placeholder: 'https://discogs.com/release/*',
      parent: '.tracklist_track:not(.track_heading)',
      index: '.tracklist_track_pos',
      title: '.tracklist_track_title > span',
      length: '.tracklist_track_duration span'
    },
    {
      name: 'Free Music Archive',
      extractor: 'node',
      placeholder: 'https://freemusicarchive.org/music/*/*',
      parent: '.play-item',
      index: '.playtxt > b',
      title: '.playtxt > a > b',
      length: '.playtxt'
    },
    {
      name: 'Genius',
      extractor: 'node',
      placeholder: 'https://genius.com/albums/*/*',
      parent: '.chart_row',
      index: 'chart_row-number_container-number',
      title: '.chart_row-content-title',
      length: false
    },
    {
      name: 'Google Play',
      extractor: 'node',
      placeholder: 'https://play.google.com/store/music/album/*',
      parent: '[data-album-is-available]',
      index: '[data-update-url-on-play] div',
      title: "[itemprop='name']",
      length: '[aria-label]'
    },
    {
      name: 'Juno Download',
      extractor: 'node',
      placeholder: 'https://www.junodownload.com/products/*',
      parent: '.product-tracklist-track',
      index: '.track-title',
      title: "[itemprop='name']",
      length: '.col-1'
    },
    {
      name: 'Last.fm',
      extractor: 'node',
      placeholder: 'https://www.last.fm/music/*/*',
      parent: '.chartlist-row',
      index: '.chartlist-index',
      title: '.chartlist-name a',
      length: '.chartlist-duration'
    },
    {
      name: 'Loot.co.za',
      extractor: 'node',
      placeholder: 'https://www.loot.co.za/product/*/*',
      parent: '#tabs div:nth-last-child(2) .productDetails tr:not([style])',
      index: 'td[width]',
      title: 'td:not([width])',
      length: false
    },
    {
      name: 'Metal Archives',
      extractor: 'node',
      placeholder: 'https://www.metal-archives.com/albums/*/*/*',
      parent: '.table_lyrics .even, .table_lyrics .odd',
      index: 'td',
      title: '.wrapWords',
      length: "td[align='right']"
    },
    {
      name: 'MusicBrainz',
      extractor: 'node',
      placeholder: 'https://musicbrainz.org/release/*',
      parent: '#content tr.odd, #content tr.even',
      index: 'td.pos',
      title: 'td > a bdi, td .name-variation > a bdi',
      length: 'td.treleases'
    },
    {
      name: 'Musik-Sammler',
      extractor: 'node',
      placeholder: 'https://www.musik-sammler.de/release/*',
      parent: "[itemprop='track'] tbody tr",
      index: '.track-position',
      title: '.track-title span',
      length: '.track-time'
    },
    {
      name: 'Naxos Records',
      extractor: 'node',
      placeholder: 'https://www.naxos.com/catalogue/item.asp?item_code=*',
      parent: "table[valign='top']",
      index: 'td:first-child',
      title: 'td:nth-child(4) b',
      length: 'td:nth-child(4)'
    },
    {
      name: 'Qobuz',
      extractor: 'node',
      placeholder: 'https://www.qobuz.com/*/album/*/*',
      parent: '.track',
      index: '.track__item--number span',
      title: '.track__item--name span',
      length: '.track__item--duration'
    },
    {
      name: 'Vinyl Digital',
      extractor: 'node',
      placeholder: 'https://vinyl-digital.com/*/*',
      parent: '#playlist_table tr:not(:first-child):not([style])',
      index: '.track',
      title: '.tracktitle span',
      length: 'td:not([class])'
    },
    {
      name: 'YouTube Music',
      extractor: 'regex',
      placeholder: 'https://music.youtube.com/playlist?list=*',
      parent: /{\\"musicTrack\\":.*?}}}},/g,
      index: /(?<=\\"albumTrackIndex\\":\\").*?(?=\\",)/,
      title: /(?<=\\"title\\":\\").*?(?=\\",)/,
      length: false
    }
  ]

  if (!localStorage.getItem('ttrym-sites')) localStorage.setItem('ttrym-sites', sitestmp.map(x => x.name))
  var sites = sitestmp.filter(x => localStorage.getItem('ttrym-sites').includes(x.name))

  parent.width(489)
  parent.append("<br><br>Or import tracklists from other sites using TracklistToRYM.<p style='display:flex'><select id='ttrym-site'>" +
                sites.map(x => "<option value='" + x.name + "'>" + x.name + '</option>').join('') +
                "</select><input id='ttrym-link' placeholder='Album URL' style='flex:1'></input><button id='ttrym-submit'>Import</button></p>" +
                "<p><input id='ttrym-sources' name='ttrym-sources' type='checkbox' checked><label for='ttrym-sources'> Add URL to sources </label>" +
                "<input id='ttrym-append' name='ttrym-append' type='checkbox'><label for='ttrym-append'> Append instead of replace </label>" +
                "<button id='ttrym-sites' style='float:right'>Manage sites</button></p>")

  $('#ttrym-site').bind('change', function () {
    $('#ttrym-link').attr('placeholder', sites.filter(x => x.name === $(this).val())[0].placeholder)
  })
  $('#ttrym-site').trigger('change')

  $('#ttrym-submit').click(function () {
    clearMessages(['success', 'warning', 'error'])
    if (!$('#ttrym-link').val()) return printMessage('error', 'No URL specified! Please enter one and try again.')
    printMessage('info', 'Importing, please wait...')

    try {
      var site = $('#ttrym-site').val()
      var input = sites.filter(x => x.name === site)[0]
      var link = $('#ttrym-link').val()

      if (!globToRegex(input.placeholder).test(link)) {
        var suggestion = sites.filter(x => globToRegex(x.placeholder).test(link))[0]
        if (suggestion) {
          input = suggestion
          $('#ttrym-site').val(input.name)
        } else {
          printMessage('warning', "Warning: Entered URL does not match the selected site's placeholder. Request may not succeed.")
        }
      }

      GM.xmlHttpRequest({
        method: 'GET',
        url: link,
        onload: (response) => {
          var data = response.responseText

          var result = ''
          var amount = 0

          switch (input.extractor) {
            case 'json':
              JSON.parse(data).forEach(element => {
                amount++
                var index = input.index ? reduceJson(element[input.parent], input.index) : amount
                var title = input.title ? reduceJson(element[input.parent], input.title) : ''
                var length = input.length ? reduceJson(element[input.parent], input.length) : ''
                result += getResult(index, title, length)
              })
              break

            case 'node':
              $(data).find(input.parent).each(function () {
                amount++
                var index = parseNode($(this).find(input.index)) || amount
                var title = parseNode($(this).find(input.title)) || ''
                var length = parseNode($(this).find(input.length)) || ''
                result += getResult(index, title, length)
              })
              break

            case 'regex':
              data.match(input.parent).forEach(function (i) {
                amount++
                var index = input.index ? i.match(input.index).toString() : amount
                var title = input.title ? i.match(input.title) : ''
                var length = input.length ? i.match(input.length) : ''
                result += getResult(index, title, length)
              })
              break

            default:
              clearMessages(['info', 'warning'])
              return printMessage('error', 'Error: ' + input.extractor + " is not a valid extractor. This is (probably) not your fault, please report this on <a href='https://github.com/TheLastZombie/userscripts/issues/new?title=" + input.extractor + "%20is%20not%20a%20valid%20extractor&labels=TracklistToRYM'>GitHub</a>.")
          }

          if (amount === 0) {
            clearMessages('info')
            return printMessage('warning', 'Did not find any tracks. Please check your URL and try again.')
          }

          goAdvanced()
          $('#track_advanced').val($('#ttrym-append').prop('checked') ? $('#track_advanced').val() + result : result)
          goSimple()

          if ($('#ttrym-sources').prop('checked') && !$('#notes').val().includes($('#ttrym-link').val())) {
            $('#notes').val($('#notes').val() + ($('#notes').val() === '' ? '' : '\n') + $('#ttrym-link').val())
          }
          $('#ttrym-link').val('')

          printMessage('success', 'Successfully imported ' + amount + ' tracks.')
          clearMessages('info')
        },

        onerror: () => {
          printMessage('error', response.responseText)
          clearMessages('info')
        }
      })
    } catch (e) {
      printMessage('error', e.toString())
      clearMessages('info')
    }
  })

  $('#ttrym-sites').click(function () {
    $('body').append("<div id='ttrym-sites-wrapper' style='box-sizing:border-box;width:100vw;height:100vh;position:fixed;top:0;background:rgba(255,255,255,0.75);padding:50px;z-index:80;'>" +
                     "<div class='submit_step_box' style='padding:25px'><span class='submit_step_header' style='margin:0!important'>" +
                     "TracklistToRYM: <span class='submit_step_header_title'>Manage sites</span></span>" +
                     "<p style='margin-top:15px'>Below, you can choose which sites to show and which ones to hide in the TracklistToRYM selection box.<br>" +
                     'A reload is required to apply any changes. If, when saving, no sites are selected, all of them will be enabled again.<br>' +
                     "Note that newly added sites are disabled by default, so you may want to check this dialog when there's been an update.</p>" +
                     sitestmp.map(x => "<input type='checkbox' class='ttrym-checkbox' name='" + x.name + "'><label style='position:relative;bottom:3px'> " + x.name + " <span style='opacity:0.5;font-weight:lighter'>" + x.placeholder + '</span></label><br>').join('') +
                     "<div style='margin-top:15px'><button id='ttrym-enable'>Enable all sites</button><button id='ttrym-disable' style='margin-left:10px'>Disable all sites</button></div>" +
                     "<div style='margin-top:10px'><button id='ttrym-save'>Save and reload page</button><button id='ttrym-discard' style='margin-left:10px'>Close window without saving</button></div>" +
                     '</div></div>')

    $('.ttrym-checkbox').each(function () {
      if (sites.map(x => x.name).includes($(this).attr('name'))) $(this).prop('checked', true)
    })

    $('#ttrym-enable').click(function () {
      $('.ttrym-checkbox').prop('checked', true)
    })

    $('#ttrym-disable').click(function () {
      $('.ttrym-checkbox').prop('checked', false)
    })

    $('#ttrym-save').click(function () {
      var sites = $('.ttrym-checkbox:checked').map(function () {
        return $(this).attr('name')
      }).get()
      localStorage.setItem('ttrym-sites', sites)
      location.reload()
    })

    $('#ttrym-discard').click(function () {
      $('#ttrym-sites-wrapper').remove()
    })
  })

  function clearMessages (levels) {
    if (!Array.isArray(levels)) levels = [levels]
    $(levels.map(x => '#ttrym-' + x).join(', ')).remove()
  }

  function getResult (index, title, length) {
    return parseIndex(index.toString()) + '|' + title.trim() + '|' + parseLength(length) + '\n'
  }

  function globToRegex (glob) {
    return new RegExp(glob.replace(/[.+\-?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'))
  }

  function parseIndex (index) {
    return index.trim().replace(/^0+/, '').replace(/\.$/, '')
  }

  function parseLength (length) {
    var matches = length.match(/(\d+:)+\d+/)
    if (matches) return matches[0].replace(/^0+/, '')
    return length
  }

  function parseNode (node) {
    return node.first().clone().children().remove().end().text()
  }

  function printMessage (level, message) {
    var colors = {
      info: '#777',
      success: 'green',
      warning: 'orange',
      error: 'red'
    }
    parent.append("<p id='ttrym-" + level + "' style='color:" + colors[level] + "'>" + message + '</p>')
  }

  function reduceJson (object, path) {
    return path.split('.').reduce((acc, cur) => acc[cur], object)
  }
})()

// @license-end
