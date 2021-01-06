const fs = require('fs')
const path = require('path')
const os = require('os')

const paths = {
  meta: path.resolve(__dirname, '..', 'meta'),
  user: path.resolve(__dirname, '..', 'user')
}

fs.readdirSync(paths.user).forEach(x => {
  const file = fs.readFileSync(path.resolve(paths.user, x), 'utf-8')
  const match = file.match(/\/\/ ==UserScript==.*\/\/ ==\/UserScript==/gs).toString() + os.EOL
  const meta = path.resolve(paths.meta, x.replace('.user.js', '.meta.js'))

  fs.writeFileSync(meta, match)
})
