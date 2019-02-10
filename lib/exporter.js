const fs = require('fs'),
    path = require("path"),
    mysql = require('mysql');

class Exporter  {
    
    constructor() {
        this.logNow('application started successfully')
    }
    isObjectValid(arg, property = false, type = false, blank = false) {
        let status = false
        if (typeof arg == 'object')
            status = true
        if (property) {
            if (!arg[property] || typeof arg[property] == 'undefined') {
                status = false
            }
        }
        if (type && status) {
            if (typeof property == 'undefined') {
                status = false
            }
        }
        if (blank && status) {
            if (arg[property] == '' || arg[property].length == 0) {
                status = false
            }
        }
        return status
    }
    logNow(content, appName = this.appName) {
        if (typeof appName == 'undefined')
            appName = __filename.split('.')[0].split('/')[__filename.split('.')[0].split('/').length - 1];
        if (appName && typeof content != 'undefined' && typeof content == 'string') {
            let dir = "./"+appName+"-logs";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, '0777', (fol_err) => {
                    if (fol_err) {
                        console.error(`${dir} not found. Exception : ${fol_err}`);
                        return false;
                    }
                })
            }
            let fileName = dir+"/"+appName+".log";
            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let month = currentDate.getMonth();
            let day = currentDate.getDate();
            let hour = currentDate.getHours();
            let min = currentDate.getMinutes();
            let sec = currentDate.getSeconds();
            month = (month < 10) ? "0"+month : month;
            day = (day < 10) ? "0"+day : day;
            hour = (hour < 10) ? "0"+hour : hour;
            min = (min < 10) ? "0"+min : min;
            sec = (sec < 10) ? "0"+sec : sec;
            let line = ((new Error().stack).split("at ")[3]).trim().split(' ')[1].split('/')
            line = line[line.length-1].replace(')', ' ')
            let logOption = [
                line,
                year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec,
                " => ",
                content                
            ];
            logOption = logOption.join(" ")+"\n";

            fs.appendFileSync(fileName, logOption, (ferr) => {
                if (ferr) 
                    console.error(`Log file not created: ${ferr}`);
            });
        }
        else {
            console.error(`unable to create log file : ${content}`);
            return false;
        }
    }
    /* mysqlConnection(credential) {
        return new Promise(async (resolve, reject) => {
            if (!credential || typeof credential == 'undefined' || typeof credential != 'object')
                return reject('invalid credential')
            var connection = await mysql.createConnection(credential);
            await connection.connect((err) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    process.exporter.logNow(`mysqlInit Error: ${err.stack}`)
                    process.exit()
                }
                console.log('mysql connected as id ' + connection.threadId);
                resolve(connection)
            });
        });
    } */
    mysqlConnectionPool(credential) {
        return new Promise(async (resolve, reject) => {
            if (!credential || typeof credential == 'undefined' || typeof credential != 'object')
                return reject('invalid credential')
            return resolve(mysql.createPool(credential));
        });
    }

}
module.exports = (new Exporter());