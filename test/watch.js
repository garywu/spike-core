import Roots from '..'
import fs from 'fs'
import {
  test,
  fixturesPath,
  path
} from './_helpers'

test.cb('watches the project, reloads on modification', (t) => {
  const project = new Roots({
    root: path.join(fixturesPath, 'watch'),
    server: {
      open: false
    }
  })
  let i = 0

  // right now it compiles twice on the first shot for some reason
  project.on('compile', (res) => {
    i++
    if (i > 1) {
      const file = path.join(fixturesPath, 'watch/index.jade')
      fs.appendFileSync(file, ' ')
      fs.writeFileSync(file, fs.readFileSync(file, 'utf8').trim())
    }
    if (i > 2) {
      watcher.close()
      t.end()
    }
  })

  const watcher = project.watch()
  t.ok((typeof watcher.startTime) === 'number')
})