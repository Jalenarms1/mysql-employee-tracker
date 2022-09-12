let deptArr = [];
let deptNames = [];
let rolesArr = [];
let roleNames = [];
let managerNames = [];
let holdManagers = [];
let employeeNames = [];
let holdEmployees = [];
const mysql = require("mysql2")

const db = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "employees_db"
})

const glueFirstNLast = (obj) => {
    let first = obj.first_name;
    let last = obj.last_name;
    let id = obj.id;
    return `${id} ${first} ${last}`
}




db.query("SELECT * FROM employee WHERE role_id = 1", (err, res) => {
    res.forEach(item => {
        managerNames.push(glueFirstNLast(item))
        holdManagers.push(item);
    })

})

db.query("SELECT * FROM employee", (err, res) => {
    if(err){
        console.log(err)
    }
    res.forEach(item => {
        employeeNames.push(glueFirstNLast(item));
        holdEmployees.push(item);
    })

})


db.query("SELECT * FROM departments", (err, res) => {
    res.forEach(item => {
        deptNames.push(item.name)
        deptArr.push(item)
    })

})

db.query("SELECT * FROM roles", (err, res) => {
    res.forEach(item => {
        rolesArr.push(item);  
        roleNames.push(`${item.title}`)
    })

})

module.exports = {
    deptArr,
    deptNames,
    roleNames,
    rolesArr,
    managerNames,
    holdManagers,
    employeeNames,
    holdEmployees
}