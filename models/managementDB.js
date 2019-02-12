const mysql = require('mysql')

// process.local : defined in env.js

class ManagementDB {
    // MySQL: insert
    save(table, input) {
        return new Promise((resolve, reject) => {
            process.local.getConnection(function(err, connection) {
                if (err)
                    return reject(err)
                let query = "INSERT INTO ?? SET ? ";
                query = mysql.format(query, [table]);
                console.log(connection)
                connection.query(query, input, function(err, result) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve(result);
                });
            });
        })
    }
    // MySQL: update, delete 
    query(query, input) {
        return new Promise((resolve, reject) =>{
            process.local.getConnection(function(err, connection) {
                if (err)
                    return reject(err)
                query = mysql.format(query, input);
                connection.query(query, input, function(err, result, fields) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve(result);
                });
            });
        })
    }
    getData(table) {
        return new Promise((resolve, reject) =>{
            process.local.getConnection(function(err, connection) {
                if (err)
                    return reject(err)
                if (typeof table == 'undefined' || table.length < 5)
                    return reject('invalid input')
                let query = "SELECT * FROM ?? ";
                query = mysql.format(query, [table]);
                connection.query(query, [], function(err, rows, columns) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve(rows);
                });
            });
        })
    }
    getAllData() {
        return new Promise((resolve, reject) =>{
            process.local.getConnection(function(err, connection) {
                if (err)
                    return reject(err)
                let query = "SELECT e.emp_id, e.first_name AS ef_name, e.last_name AS el_name,m.first_name AS mf_name, m.last_name AS ml_name,p.project_name FROM employee e INNER JOIN emp_work_info w ON e.emp_id = w.emp_id INNER JOIN project p ON w.project_id = p.project_id INNER JOIN manager m ON p.project_id = m.manager_id";
                connection.query(query, [], function(err, rows, columns) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve(rows);
                });
            });
        })
    }
}
module.exports = new ManagementDB()