// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-disable no-undef */

// ==UserScript==
// @name           StreetVoiceLoader
// @namespace      https://github.com/TheLastZombie/
// @version        1.2.0
// @description    Enables downloading of tracks and albums from StreetVoice.
// @description:de Erlaubt das Herunterladen von Liedern und Alben von StreetVoice.
// @homepageURL    https://github.com/TheLastZombie/userscripts#streetvoiceloader-
// @supportURL     https://github.com/TheLastZombie/userscripts/issues/new?labels=StreetVoiceLoader
// @downloadURL    https://raw.github.com/TheLastZombie/userscripts/master/user/StreetVoiceLoader.user.js
// @updateURL      https://raw.github.com/TheLastZombie/userscripts/master/meta/StreetVoiceLoader.meta.js
// @author         TheLastZombie
// @match          https://streetvoice.com/*/songs/*
// @connect        streetvoice.com
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @require        https://cdn.jsdelivr.net/gh/gildas-lormeau/zip.js@21e1832c1ab1f8fdaffeaad0305af84040987538/dist/zip.min.js
// @require        https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js@5bb701bd6ea05a02836daf8ef88ec350a1dd4d83/dist/FileSaver.min.js
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon           https://raw.githubusercontent.com/TheLastZombie/userscripts/master/icons/StreetVoiceLoader.ico
// @copyright      2021, TheLastZombie (https://github.com/TheLastZombie/)
// @license        MIT; https://github.com/TheLastZombie/userscripts/blob/master/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author         TheLastZombie
// ==/OpenUserJS==

(function () {
  const awrapper = document.getElementsByClassName('list-item-buttons')[0]
  const song = window.location.toString().split('/')[5]

  GM.xmlHttpRequest({
    method: 'POST',
    url: 'https://streetvoice.com/api/v3/songs/' + song + '/file/',
    onload: response => {
      const file = JSON.parse(response.response).file

      awrapper.insertAdjacentHTML('afterbegin', '<li class="list-inline-item"><a href="' + file + '" download class="btn btn-circle btn-outline-white btn-lg"><span>⬇</span></a></li>')
    }
  })

  const links = document.querySelectorAll('#item_box_list > li')
  const album = []

  links.forEach(x => {
    const swrapper = x.getElementsByClassName('list-item-buttons')[0]
    const song = x.getElementsByTagName('a')[0].getAttribute('href').split('/')[3]

    GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://streetvoice.com/api/v3/songs/' + song + '/file/',
      onload: response => {
        const file = JSON.parse(response.response).file
        album.push(file)

        swrapper.style.width = 'max-content'
        swrapper.insertAdjacentHTML('beforeend', '<li class="list-inline-item"><a href="' + file + '" download class="btn btn-circle btn-white"><span>⬇</span></a></li>')

        if (album.length === links.length) {
          awrapper.insertAdjacentHTML('afterbegin', '<li class="list-inline-item"><a href="#" id="svl-download" class="btn btn-circle btn-outline-white btn-lg"><span>⬇</span></a></li>')
          const adownload = document.getElementById('svl-download')

          adownload.onclick = (e) => {
            e.preventDefault()

            const blobWriter = new zip.BlobWriter('application/zip')
            const writer = new zip.ZipWriter(blobWriter)

            function forSync (i) {
              adownload.innerHTML = '<small>' + (i + 1) + '/' + album.length + '</small>'

              GM.xmlHttpRequest({
                method: 'GET',
                url: album[i],
                responseType: 'blob',
                onload: async response => {
                  await writer.add(decodeURIComponent(album[i].split('/').pop().split('?')[0]), new zip.BlobReader(response.response))

                  if (album[i + 1]) {
                    forSync(i + 1)
                  } else {
                    adownload.innerHTML = '⬇'

                    await writer.close()
                    const blob = await blobWriter.getData()
                    saveAs(blob, document.getElementsByTagName('h1')[0].textContent.trim() + '.zip')
                  }
                }
              })
            }
            forSync(0)
          }
        }
      }
    })
  })
})()

// @license-end
