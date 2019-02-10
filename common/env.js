
// all the credentials are stored in config.json file
process.CONFIG = require('../configs/config.json')

// consist of all major  function such as db connection, logging, validation
process.exporter = require("../lib/exporter.js")

// create DB connection object function
process.mysqlPoolInit = (globalName, config = process.CONFIG.mysql.local) => {
    return process.exporter.mysqlConnectionPool(config)
        .then((mysqlConnObj) => {
            console.log('mysql pool connected')
            process[globalName] = mysqlConnObj        
        })
        .catch((dbInitErr) => {
            console.log(`mysqlInit Error: ${dbInitErr}`)
            process.exporter.logNow(`mysqlInit Error: ${dbInitErr}`)
            process.exit()
        });
}
// making connection with localhost, Connection Object name will be `process.local` which will be accessed globally
process.mysqlPoolInit('local') 

// include model globally
process.managementDB = require('../models/managementDB.js')