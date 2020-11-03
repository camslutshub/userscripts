const fs = require('fs')
const path = require('path')
const standard = require('standard')

const paths = {
  meta: path.resolve(__dirname, '..', 'meta'),
  user: path.resolve(__dirname, '..', 'user')
}

const files = [
  ...fs.readdirSync(paths.meta).map(x => path.resolve(paths.meta, x)),
  ...fs.readdirSync(paths.user).map(x => path.resolve(paths.user, x))
]

standard.lintFiles(files, {
  fix: true
}, (err, results) => {
  if (err) console.log(err)
  if (results) console.log(results)
})
