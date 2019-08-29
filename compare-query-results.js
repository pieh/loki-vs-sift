const fs = require(`fs-extra`)
const path = require(`path`)
const v8 = require('v8');
const _ = require(`lodash`)

const stateCopiesDir = path.join(process.cwd(), `_states`)
const queryResultsDir = path.join(process.cwd(), `public`, `static`, `d`);

const readStateFile = (file) => {
  const data = fs.readFileSync(file)
  return v8.deserialize(data)
}

const redux = readStateFile(path.join(stateCopiesDir, `redux.state`)).staticQueryComponents
const loki = readStateFile(path.join(stateCopiesDir, `loki.state`)).staticQueryComponents


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
