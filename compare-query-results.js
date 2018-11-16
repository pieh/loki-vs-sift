const fs = require(`fs-extra`)
const path = require(`path`)
const _ = require(`lodash`)

const stateCopiesDir = path.join(process.cwd(), `_states`)
const queryResultsDir = path.join(process.cwd(), `public`, `static`, `d`)

const redux = JSON.parse(
  fs.readFileSync(path.join(stateCopiesDir, `redux.json`))
).jsonDataPaths
const loki = JSON.parse(fs.readFileSync(path.join(stateCopiesDir, `loki.json`)))
  .jsonDataPaths

const uniqueKeys = _.uniq(_.keys(redux).concat(_.keys(loki)))

const diffs = {}

uniqueKeys.forEach(key => {
  if (redux[key] !== loki[key]) {
    diffs[key] = {
      loki: loki[key],
      redux: redux[key],
    }

    // copy query result from loki to `_states/queries-loki/${queryID}.json`
    fs.copyFileSync(
      path.join(queryResultsDir, `${loki[key]}.json`),
      path.join(stateCopiesDir, `queries-loki`, `${key}.json`)
    )

    // copy query result from loki to `_states/queries-redux/${queryID}.json`
    fs.copyFileSync(
      path.join(queryResultsDir, `${redux[key]}.json`),
      path.join(stateCopiesDir, `queries-redux`, `${key}.json`)
    )
  }
})

console.table(diffs)
