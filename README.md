
## API based Project Management in NodeJS ##

This app includes following APIs:
- **registration** `http://localhost:3000/pm/save`: POST

  ###### Body part:
  *employee(type:1)*
  ```
    first_name:   arjun
    last_name:    singh
    designation:  developer
    latitude:     458.67
    longitude:    445.67
    type:         1
  ```
  *manager(type:2)*
  ```
    first_name:   arjun
    last_name:    singh
    latitude:     458.67
    longitude:    445.67
    type:         2
  ```
  *project(type:3)*
  ```
    project_name:  p1
    start_date:    '2019-02-10'
    type:          3
  ```
- **assign project to employee or manager** `http://localhost:3000/pm/assign` :  POST
  ###### Body part:
  *employee*`
  ```
    emp_id:     1
    type:       1
    project_id: 1
  ```
  *manager*`
  ```
    manager_id: 1
    type:       2
    project_id: 1
  ```
- **see all data** `http://localhost:3000/pm/viewall` : GET

- **see one particular data** `http://localhost:3000/pm/view?type=1` : GET 

- **edit data** `http://localhost:3000/pm/edit` :   POST
  ```
    type:       2
    manager_id: 1
    last_name:  wadhwa
  ```
- **delete record** `http://localhost:3000/pm/remove`: POST
  ```
    type:       3
    project_id: 6
  ```

**Requirements**
- MySQL
- <a href="https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/">NodeJS (10*)</a>

**Do following things before running the app**
- make a Database (`winzify`) in MySQL and use it
- execute following queries in MySQL
  1. Create Table: CREATE TABLE `employee` (
    `emp_id` int(5) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(100) DEFAULT NULL,
    `last_name` varchar(100) DEFAULT NULL,
    `designation` varchar(100) DEFAULT NULL,
    `manager_id` int(5) DEFAULT NULL,
    `latitude` decimal(11,8) DEFAULT NULL,
    `longitude` decimal(11,8) DEFAULT NULL,
    PRIMARY KEY (`emp_id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1

  2. Create Table: CREATE TABLE `manager` (
    `manager_id` int(5) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(100) DEFAULT NULL,
    `last_name` varchar(100) DEFAULT NULL,
    `project_id` int(5) DEFAULT NULL,
    `latitude` decimal(11,8) DEFAULT NULL,
    `longitude` decimal(11,8) DEFAULT NULL,
    PRIMARY KEY (`manager_id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1
  
  3. Create Table: CREATE TABLE `project` (
    `project_id` int(5) NOT NULL AUTO_INCREMENT,
    `project_name` varchar(200) DEFAULT NULL,
    `status` int(2) DEFAULT '0',
    `start_date` date NOT NULL,
    `end_date` date DEFAULT NULL,
    PRIMARY KEY (`project_id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1
  
  4. Create Table: CREATE TABLE `emp_work_info` (
    `emp_id` int(5) NOT NULL,
    `project_id` int(5) NOT NULL,
    `duration` varchar(100) DEFAULT NULL,
    `status` int(2) DEFAULT '0',
    UNIQUE KEY `unique_emp_project` (`emp_id`,`project_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
 
- Setup your config as required (`configs/config.json`)
- run command `npm install` to install all the dependencies
- install nodemon globally if you want to run your app on `watch` (`npm install -g nodemon`)


**App Execution**
- `nodemon index.js`
