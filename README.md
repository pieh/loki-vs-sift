## build-query-results.js

`node build-query-results.js` in your site - it will:
 - clear .cache, run `GATSBY_DB_NODES=loki gatsby build` and copy `redux-state.json` to `_states/loki.json`
 - clear .cache, run `gatsby build` and copy `redux-state.json` to `_states/redux.json`
 - present some stats for:
   - runningQueries time
   - queriesPerSecond
   - page count (to quickly determine if there are differences in dynamically generated pages)
   - and total time spend on build
   
## compare-query-results.js

After running `build-query-results.js`, run `compare-query-results.js` in your site - it will:
 - extract `jsonDataPaths` from `_states/loki.json` and `_states/redux.json` to compare if query results are different between those engines
 - display table with paths for which query results differs
 - copy query results that are different to `_states/queries_loki`/`_states/queries_redux` so it's easier to inspect differences
