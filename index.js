const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { deptArr, deptNames, rolesArr, roleNames, managerNames, holdManagers, employeeNames, holdEmployees  } = require("./queries");

const glueFirstNLast = (obj) => {
    let first = obj.first_name;
    let last = obj.last_name;
    let id = obj.id;
    return `${id} ${first} ${last}`
}

const numFix = (str) => {
    if(str.includes(",")){
        let commaIndex = str.indexOf(",");
        let beg = str.slice(0, commaIndex);
        let end = str.slice(commaIndex + 1);
        let fullNum = `${beg}${end}`
        return fullNum
    }
    return str
}

const db = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "employees_db"
})

class Questions {
    constructor(){}

    starter(){
        inquirer
            .prompt([
                {
                    "type": "list",
                    "name": "action",
                    "message": "Choose which of these you would like to do next.",
                    "choices": ["View all departments", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role"]
                    

                }
            ])
            .then(res => {
                switch (res.action) {
                    case "View all departments":
                        this.viewAllDept();
                        break;
                    case  "View all roles":
                        this.viewAllRoles();
                        break;
                    case "Add a department":
                        this.addDept();
                        break;
                    case "Add a role":
                        this.addRole();
                        break;
                    case "Add an employee":
                        this.addEmployee();
                        break;
                    case "Update employee role":
                        this.updateEmployeeRole();
                        break;
                    default:
                        break;

                }
            })
    }

    viewAllDept(){
        db.query("SELECT * FROM departments", (err, res) => {
            console.table(res)
        })
        
    }

    viewAllRoles(){
        db.query("SELECT * FROM roles", (err, res) => {
            if(err){
                console.log(err);
            }
            if(!err){
                console.table(res)
            }
        })

    }

    addDept(){
        inquirer
            .prompt([
                {
                    "name": "dept",
                    "message": "Enter the name of the department you would like to add.",
                    validate: dept => {
                        if(dept.trim() === ""){
                            return "Please make a valid entry."
                        }
                        return true 
                    }
                }
            ])
            .then(response => {
                db.query("INSERT INTO departments(name) VALUES (?)", response.dept, (err, res) => {
                    if(err){
                        console.log(err);
                    }
                    if(!err){
                        this.starter();
                        
                    }
                })
                
            })
    }

    addRole(){
        inquirer
            .prompt([
                {
                    "name": "title",
                    "message": "Enter the employee role you would like to add.",
                    validate: title => {
                        if(title.trim() === "" || !isNaN(title)){
                            return "Please make a valid entry."
                        }
                        return true 
                    }
                },
                {
                    "name": "salary",
                    "message": "Enter the salary for this role.",
                    validate: salary => {
                        if(isNaN(parseInt(salary))){
                            return "Please make a valid entry"
                        }
                        return true 
                    }
                },
                {
                    "type": "list",
                    "name": "dept",
                    "message": "Select which department this role belongs to.",
                    "choices": deptNames
                    
                }
            ])
            .then(response => {
                let deptId;
                console.log(numFix(response.salary))
                deptArr.forEach(item => {
                    if(response.dept === item.name){
                        deptId = item.id
                    }
                })
                let insertArr = [response.title, parseInt(response.salary), deptId]
                db.query("INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)", insertArr, (err, res) => {
                    if(err){
                        console.log(err);
                    }
                    if(!err){
                        this.starter();
                    }
                })
            })
    }

    addEmployee(){
        inquirer
            .prompt([
                {
                    "name": "firstName",
                    "message": "Enter the new employee's first name.",
                    validate: firstName => {
                        if(firstName.trim() === "" || !isNaN(firstName)){
                            return "Plese make a valid entry"
                        }
                        return true 
                    }
                },
                {
                    "name": "lastName",
                    "message": "Enter the new employee's last name",
                    validate: lastName => {
                        if(lastName.trim() === "" || !isNaN(lastName)){
                            return "Please make a valid entry"
                        }
                        return true 
                    }
                },
                {
                    "type": "list",
                    "name": "role",
                    "message": "Choose which role the new employee holds",
                    "choices": roleNames
                },
                {
                    "type": "list",
                    "name": "managerId",
                    "message": "Choose the new employee's Manager",
                    "choices": managerNames, 
                    when: answers => {
                        return answers.role != "Manager"
                    
                    }
                }
            ])
            .then(response => {
                let roleID =  parseFloat(response.role)
                // rolesArr.forEach(item => {
                //     if(item.title === response.role){
                //         roleID = item.id
                //     }
                // })
                let managerId;
                
                
                if(!response.managerId){
                    let insertArr = [response.firstName, response.lastName, roleID]
                    db.query("INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?)", insertArr, (err, res) => {
                        if(err){
                            console.log(err)
                        }
                        if(!err){
                            console.log("insert complete")
                        }
                    })
                }
                
                if(response.managerId){
                    managerId = parseFloat(response.managerId)
                    let insertArr = [response.firstName, response.lastName, roleID, managerId];
                    db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", insertArr, (err, res) => {
                        if(err){
                            console.log(err)
                        }
                        if(!err){
                            console.log("insert complete")
                        }
                    })
                }
                this.starter();
               
            })
    }

    updateEmployeeRole(){
        inquirer 
            .prompt([
                {
                    "type": "list",
                    "name": "employee",
                    "message": "Choose which employee's information you would like to update.",
                    "choices": employeeNames
                },
                {
                    "type": "list",
                    "name": "action",
                    "message": "Choose which information you would like to update for the employee.",
                    "choices": ["First Name", "Last Name", "Role", "Manager"]
                },
                {
                    "name": "firstChange",
                    "message": "Enter the employees new first name.",
                    validate: firstChange => {
                        if(firstChange.trim() === "" || !isNaN(firstChange)){
                            return "Please make a valid entry"
                        }
                        return true
                    },      
                    when: answers => {
                        return answers.action === "First Name"
                    }        
                },
                {
                    "name": "lastChange",
                    "message": "Enter the employees new last name.",
                    validate: lastChange => {
                        if(lastChange.trim() === "" || !isNaN(lastChange)){
                            return "Please make a valid entry"
                        }
                        return true
                    },      
                    when: answers => {
                        return answers.action === "Last Name"
                    }        
                },
                {
                    "type": "list",
                    "name": "roleChange",
                    "message": "Choose the employee's new role.",
                    "choices": roleNames,
                    when: answers => {
                        return answers.action === "Role"
                    }
                },
                {
                    "name": "managerChange",
                    "message": "Choose the employee's new manager",
                    "choices": managerNames,
                    when: answers => {
                        return answers.action === "Manager"
                    }
                }

            ])
            .then(response => {
                switch (response.action){
                    case "First Name":
                        db.query("UPDATE employee SET first_name = ? WHERE id = ?", [response.firstName, parseFloat(response.employee)])
                        break;
                    case "Last Name":
                        db.query("UPDATE employee SET last_name = ? WHERE id = ?", [response.lastName, parseFloat(response.employee)])
                        break;
                    case "Role":
                        db.query("UPDATE employee SET role_id = ? WHERE id = ?", [parseFloat(response.roleChange), parseFloat(response.employee)])
                        break;
                    case "Manager": 
                        db.query("UPDATE employee")

                }
            })
    }
}

var startIt = new Questions;

startIt.starter();
