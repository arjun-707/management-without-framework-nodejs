const expRoute = require('express').Router();

let exporter = process.exporter; // defined in env.js

// Create a new record
expRoute.post('/save', (req, res) => {
    let param = req.body 
    param = JSON.stringify(param) === JSON.stringify({}) ? req.query : param
    if (param && !exporter.isObjectValid(param, 'type', true, true)) {
        return res.status(400).json({
            error: true,
            msg: 'Invalid type or missing'
        })
    }
    let table = getTableName(parseInt(param.type))
    let input = validateTypeAndGetInput(param, res)
    if (!input)
        return false;
    process.managementDB.save(table, input)
    .then((result) => {
        if (!result.insertId || isNaN(result.insertId)) {
            return res.status(400).json({
                error: true,
                msg: 'connection error'
            })
        }
        return res.status(200).json({
            error : false,
            msg : 'success',
            data : {
                'id' : result.insertId
            }
        })
    })
    .catch((ex) => {
        return handleDuplicateEntry(ex, res)
    })
})

// Update an existing record
expRoute.post('/edit', (req, res) => {
    let param = req.body 
    param = JSON.stringify(param) === JSON.stringify({}) ? req.query : param
    if (param && !exporter.isObjectValid(param, 'type', true, true)) {
        return res.status(400).json({
            error: true,
            msg: 'Invalid type or missing'
        })
    }
    let type = parseInt(param.type)
    let update_field = []
    let where = ''
    let table = getTableName(type)
    let update_input = [table]
    switch(type) {
        case 1:
            if (param && exporter.isObjectValid(param, 'emp_id', true, true)) {
                if (param && exporter.isObjectValid(param, 'first_name', true, true)) {
                    update_field.push('first_name = ?')
                    update_input.push(param.first_name)
                }
                if (param && exporter.isObjectValid(param, 'last_name', true, true)) {
                    update_field.push('last_name = ?')
                    update_input.push(param.last_name)
                }
                if (param && exporter.isObjectValid(param, 'designation', true, true)) {
                    update_field.push('designation = ?')
                    update_input.push(param.designation)
                }
                if (param && exporter.isObjectValid(param, 'manager_id', true, true)) {
                    update_field.push('manager_id = ?')
                    update_input.push(parseInt(param.manager_id))
                }
                if (param && exporter.isObjectValid(param, 'latitude', true, true) && exporter.isObjectValid(param, 'longitude', true, true)) {
                    update_field.push('latitude = ?, longitude = ?')
                    update_input.push(parseFloat(param.latitude))
                    update_input.push(parseFloat(param.longitude))
                }
                where = "WHERE emp_id = ?";
                update_input.push(parseInt(param.emp_id))
            }
        break;
        case 2:
            if (param && exporter.isObjectValid(param, 'manager_id', true, true)) {
                if (param && exporter.isObjectValid(param, 'first_name', true, true)) {
                    update_field.push('first_name = ?')
                    update_input.push(param.first_name)
                }
                if (param && exporter.isObjectValid(param, 'last_name', true, true)) {
                    update_field.push('last_name = ?')
                    update_input.push(param.last_name)
                }
                if (param && exporter.isObjectValid(param, 'project_id', true, true)) {
                    update_field.push('project_id = ?')
                    update_input.push(parseInt(param.project_id))
                }
                if (param && exporter.isObjectValid(param, 'latitude', true, true) && exporter.isObjectValid(param, 'longitude', true, true)) {
                    update_field.push('latitude = ?, longitude = ?')
                    update_input.push(parseFloat(param.latitude))
                    update_input.push(parseFloat(param.longitude))
                }
                where = "WHERE manager_id = ?";
                update_input.push(parseInt(param.manager_id))
            }
        break;
        case 3:
            if (param && exporter.isObjectValid(param, 'project_id', true, true)) {
                if (param && exporter.isObjectValid(param, 'project_name', true, true)) {
                    update_field.push('project_name = ?')
                    update_input.push(param.project_name)
                }
                if (param && exporter.isObjectValid(param, 'status', true, true)) {
                    update_field.push('status = ?')
                    update_input.push(parseInt(param.status))
                }
                if (param && exporter.isObjectValid(param, 'start_date', true, true)) {
                    update_field.push('start_date = ?')
                    update_input.push(param.start_date)
                }
                if (param && exporter.isObjectValid(param, 'end_date', true, true)) {
                    update_field.push('end_date = ?')
                    update_input.push(param.end_date)
                }
                where = "WHERE project_id = ?";
                update_input.push(parseInt(param.project_id))
            }
        break;
        default:
            return res.status(400).json({
                error: true,
                msg: 'Cannot edit the type provided'
            })
        break;
    }
    if (update_field.length > 0) {
        query = "UPDATE ?? SET " + update_field.join(' , ') + " " + where;
        
        process.managementDB.query(query, update_input)
        .then((result) => {
            if (isNaN(result.affectedRows))
                throw 'update connection error'
            res.status(200).json({
                error : false,
                msg : 'updated',
                data : {
                    'affected' : result.affectedRows
                }
            })
        })
        .catch((ex) => {
            return handleDuplicateEntry(ex, res)
        })
    }
    else {
        return handleDuplicateEntry(ex, res)
    }
})

// Get a Single record with data from related entities
expRoute.get('/view', (req, res) => {
    let param = req.body 
    param = JSON.stringify(param) === JSON.stringify({}) ? req.query : param
    if (param && !exporter.isObjectValid(param, 'type', true, true)) {
        return res.status(400).json({
            error: true,
            msg: 'Invalid type or missing'
        })
    }

    let table = getTableName(parseInt(param.type))
    
    process.managementDB.getData(table)
    .then((result) => {
        if (!result) {
            return res.status(400).json({
                error: true,
                msg: 'connection error'
            })
        }
        return res.status(200).json({
            error : false,
            msg : 'success',
            data : result
        })
    })
    .catch((ex) => {
        return res.status(400).json({
            error: true,
            msg: 'something went wrong'
        })
    })
})

// Get All Data
expRoute.get('/viewall', (req, res) => {
    
    process.managementDB.getAllData()
    .then((result) => {
        if (!result) {
            return res.status(400).json({
                error: true,
                msg: 'connection error'
            })
        }
        res.status(200).json({
            error : false,
            msg : 'success',
            data : result
        })
    })
    .catch((ex) => {
        res.status(400).json({
            error: true,
            msg: 'something went wrong'
        })
    })
})

// assign project to employee or manager
expRoute.post('/assign', (req, res) => {
    let param = req.body 
    param = JSON.stringify(param) === JSON.stringify({}) ? req.query : param
    if (param && !exporter.isObjectValid(param, 'type', true, true)) {
        return res.status(400).json({
            error: true,
            msg: 'Invalid type or missing'
        })
    }
    let type = parseInt(param.type);
    let query = false;
    let insert_input = false;
    let update_input = false;
    let table = getTableName(type)
    switch(type) {
        case 1:
            if (param && exporter.isObjectValid(param, 'emp_id', true, true)) {
                if (param && exporter.isObjectValid(param, 'manager_id', true, true)) {
                    query = "UPDATE ?? SET manager_id = ? WHERE emp_id = ?";
                    update_input = [
                        table,
                        parseInt(param.manager_id),
                        parseInt(param.emp_id)
                    ]
                }
                if (param && exporter.isObjectValid(param, 'project_id', true, true)) {
                    table = 'emp_work_info'
                    insert_input = {
                        emp_id: parseInt(param.emp_id),
                        project_id: parseInt(param.project_id)
                    }
                }
            }
        break;
        case 2:
            if (param && exporter.isObjectValid(param, 'manager_id', true, true)) {
                if (param && exporter.isObjectValid(param, 'project_id', true, true)) {
                    query = "UPDATE ?? SET project_id = ? WHERE manager_id = ?";
                    update_input = [
                        table,
                        parseInt(param.project_id),
                        parseInt(param.manager_id)
                    ]
                }
            }
        break;
        default:
            return res.status(400).json({
                error: true,
                msg: 'Cannot edit the type provided'
            })
        break;
    }
    if (query && update_input && insert_input) {
        process.managementDB.save(table, insert_input)
        .then((result) => {
            if (isNaN(result.affectedRows))
                throw 'insert connection error'
            return 'inserted'
        })
        .then((msg) => {
            process.managementDB.query(query, update_input)
            .then((result) => {
                if (isNaN(result.affectedRows))
                    throw 'update connection error'
                res.status(200).json({
                    error : false,
                    msg : [msg, 'updated'],
                    data : {
                        'affected' : result.affectedRows
                    }
                })
            })
            .catch((ex) => {
                return handleDuplicateEntry(ex, res)
            })
        })
        .catch((ex) => {
            return handleDuplicateEntry(ex, res)
        })
    }
    else if (insert_input) {
        process.managementDB.save(table, insert_input)
        .then((id) => {
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: true,
                    msg: 'connection error'
                })
            }
            return res.status(200).json({
                error : false,
                msg : 'success',
                data : {
                    'id' : id
                }
            })
        })
        .catch((ex) => {
            return handleDuplicateEntry(ex, res)
        })
    }
    else if (query && update_input) {
        process.managementDB.query(query, update_input)
        .then((result) => {
            if (isNaN(result.affectedRows)) {
                return res.status(400).json({
                    error: true,
                    msg: 'connection error'
                })
            }
            return res.status(200).json({
                error : false,
                msg : 'updated',
                data : {
                    'affected' : result.affectedRows
                }
            })
        })
        .catch((ex) => {
            return handleDuplicateEntry(ex, res)
        })
    }
})

// Delete a record
expRoute.post('/remove', (req, res) => {
    let param = req.body 
    param = JSON.stringify(param) === JSON.stringify({}) ? req.query : param
    if (param && !exporter.isObjectValid(param, 'type', true, true)) {
        return res.status(400).json({
            error: true,
            msg: 'Invalid type or missing'
        })
    }
    let type = parseInt(param.type)
    let table = getTableName(type)
    let delete_input = false
    let depend_delete_input = false
    switch(type) {
        case 1:
            if (param && exporter.isObjectValid(param, 'emp_id', true, true)) {
                query = "DELETE FROM ?? WHERE emp_id = ?";
                delete_input = [table, parseInt(param.emp_id)]
                depend_delete_input = ['emp_work_info', parseInt(param.emp_id)]
            }
        break;
        case 2:
            if (param && exporter.isObjectValid(param, 'manager_id', true, true)) {
                query = "DELETE FROM ?? WHERE manager_id = ?";
                delete_input = [table, parseInt(param.manager_id)]
            }
        break;
        case 3:
            if (param && exporter.isObjectValid(param, 'project_id', true, true)) {
                query = "DELETE FROM ?? WHERE project_id = ?";
                delete_input = [table, parseInt(param.project_id)]
            }
        break;
        default:
            return res.status(400).json({
                error: true,
                msg: 'Cannot edit the type provided'
            })
        break;
    }
    if (delete_input && depend_delete_input){
        process.managementDB.query(query, delete_input)
        .then((result) => {
            if (isNaN(result.affectedRows))
                throw 'remove connection error'
            return 'removed'
        })
        .then((msg) => {
            process.managementDB.query(query, depend_delete_input)
            .then((result) => {
                if (isNaN(result.affectedRows))
                    throw 'update connection error'
                res.status(200).json({
                    error : false,
                    msg : [msg, 'dependent removed'],
                    data : {
                        'affected' : result.affectedRows
                    }
                })
            })
            .catch((ex) => {
                return res.status(400).json({
                    error: true,
                    msg: 'something went wrong'
                })
            })
        })
        .catch((ex) => {
            return res.status(400).json({
                error: true,
                msg: 'something went wrong'
            })
        })
    }
    else if (delete_input) {
        process.managementDB.query(query, delete_input)
        .then((result) => {
            if (isNaN(result.affectedRows))
                throw 'remove connection error'
            res.status(200).json({
                error : false,
                msg : 'removed',
                data : {
                    'affected' : result.affectedRows
                }
            })
        })
        .catch((ex) => {
            return res.status(400).json({
                error: true,
                msg: 'something went wrong',
                e: ex
            })
        })
    }
    else {
        return res.status(200).json({
            error: false,
            msg: 'nothing removed'
        })
    }
})

getTableName = (input) => {
    switch(input) {
        case 1:
            return 'employee';
        break;
        case 2:
            return 'manager';
        break;
        case 3:
            return 'project';
        break;
        default:
            return '';
        break;
    }
}
validateTypeAndGetInput = (param) => {
    switch(parseInt(param.type)) {
        case 1:
            if (param && !exporter.isObjectValid(param, 'first_name', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid first_name or missing'
                })
                return false
            }
            if (param && !exporter.isObjectValid(param, 'designation', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid designation or missing'
                })
                return false
            }
            /* if (param && !exporter.isObjectValid(param, 'manager_id', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid manager_id or missing`'
                })
                return false
            } */
            if (param && !exporter.isObjectValid(param, 'latitude', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid latitude or missing`'
                })
                return false
            }
            if (param && !exporter.isObjectValid(param, 'longitude', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid longitude or missing`'
                })
                return false
            }
            return {
                first_name: param.first_name,
                last_name: param.last_name ? param.last_name : '',
                designation: param.designation,
                manager_id: param.manager_id ? parseInt(param.manager_id): 0,
                latitude: parseFloat(param.latitude),
                longitude: parseFloat(param.longitude)
            }
        break;
        case 2:
            if (param && !exporter.isObjectValid(param, 'first_name', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid first_name or missing'
                })
                return false
            }
            /* if (param && !exporter.isObjectValid(param, 'project_id', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid designation or missing'
                })
                return false
            } */
            if (param && !exporter.isObjectValid(param, 'latitude', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid latitude or missing`'
                })
                return false
            }
            if (param && !exporter.isObjectValid(param, 'longitude', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid longitude or missing`'
                })
                return false
            }
            return {
                first_name: param.first_name,
                last_name: param.last_name ? param.last_name : '',
                project_id: param.project_id? parseInt(param.project_id): 0,
                latitude: parseFloat(param.latitude),
                longitude: parseFloat(param.longitude)
            }
        break;
        case 3:
            if (param && !exporter.isObjectValid(param, 'project_name', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid first_name or missing'
                })
                return false
            }
            if (param && !exporter.isObjectValid(param, 'start_date', true, true)) {
                res.status(400).json({
                    error: true,
                    msg: 'Invalid designation or missing'
                })
                return false
            }
            return {
                project_name: param.project_name,
                start_date: param.start_date
            }
        break;
        default:
            return false;
        break;
    }
}
handleDuplicateEntry = (ex, res) => {
    if (ex.errno == 1062) 
        res.status(200).json({
            error : false,
            msg : 'updated',
            data : {
                'affected' : 0
            }
        })
    else
        res.status(400).json({
            error: true,
            msg: 'something went wrong',
            e: ex
        })
}
module.exports = expRoute