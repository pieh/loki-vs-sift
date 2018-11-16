const fs = require(`fs-extra`)
const path = require(`path`)
const { execSync } = require(`child_process`)

const stateCopiesDir = path.join(process.cwd(), `_states`)
const reduxStatePath = path.join(process.cwd(), `.cache`, `redux-state.json`)

const grabResults = str => {
  const runGraphqlQueriesMatches = /run graphql queries[—-\s]*([\d.]+)\D+(\d+)[/]\d+\s([\d.]+)/g.exec(
    str
  )
  const doneBuildingMatches = /Done building in [—-\s]*([\d.]+)/g.exec(str)

  const output = {
    runningQueries: parseFloat(runGraphqlQueriesMatches[1]),
    pages: parseFloat(runGraphqlQueriesMatches[2]),
    queriesPerSecond: parseFloat(runGraphqlQueriesMatches[3]),
    done: parseFloat(doneBuildingMatches[1]),
  }
  return output
}

fs.ensureDirSync(stateCopiesDir)

let cmd

/* --- LOKI --- */
cmd = `rm -rf .cache && GATSBY_DB_NODES=loki gatsby build`
console.log(`
Build with loki nodes:
  > ${cmd}
`)
const outputLoki = execSync(cmd, {
  encoding: `utf-8`,
})
console.log(outputLoki)

fs.copyFileSync(reduxStatePath, path.join(stateCopiesDir, `loki.json`))

const resultsLoki = grabResults(outputLoki)
/* --- END LOKI --- */

/* --- REDUX --- */
cmd = `rm -rf .cache && gatsby build`
console.log(`
Build with redux nodes:
  > ${cmd}
`)
const outputRedux = execSync(cmd, {
  encoding: `utf-8`,
})
console.log(outputRedux)

const resultsRedux = grabResults(outputRedux)

fs.copyFileSync(reduxStatePath, path.join(stateCopiesDir, `redux.json`))
/* --- END REDUX --- */

console.table({ redux: resultsRedux, loki: resultsLoki })
