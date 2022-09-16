const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { deptArr, deptNames, rolesArr, roleNames, managerNames, holdManagers, employeeNames, holdEmployees  } = require("./utils/queries");


const questions = require("./utils/questions");

// this function will construct the list of employee names to show id and first and last name in one list item
const glueFirstNLast = (obj) => {
    let first = obj.first_name;
    let last = obj.last_name;
    let id = obj.id;
    return `${id} ${first} ${last}`
}

//this function will take the salary input from the user and remove the comma if there was one included, before inserting into the database
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

//creates connection to database
const db = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "employees_db"
})

// class to control flow of questions
class Questions {
    constructor(){}

    //directs the user based on which selection is made
    starter(){
        inquirer
            .prompt(questions.startQs)
            .then(res => {
                switch (res.action) {
                    case "View all departments":
                        this.viewAllDept();
                        break;
                    case "View all employees":
                        this.viewAllEmployees();
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
                    case "Delete item":
                        this.deleteItem();
                        break;
                    default:
                        break;

                }
            })
    }

    //queries db to see all departments
    viewAllDept(){
        db.query("SELECT * FROM departments", (err, res) => {
            if(err){
                console.log(err);
            }
            console.table(res)

            inquirer
                .prompt(questions.advQs)
                .then(res => {
                    if(res.advancer.toLowerCase() === "y"){
                        this.starter()
                    }else{
                        return;
                    }
                })
            
        })
        
        
    }

    //queries db to see all employees
    viewAllEmployees(){
        db.query("SELECT * FROM employee", (err, res) => {
            if(err){
                console.log(err);
            }
            if(!err){
                console.table(res)
            }
            inquirer
                .prompt(questions.advQs)
                .then(res => {
                    if(res.advancer.toLowerCase() === "y"){
                        this.starter()
                    }else{
                        return;
                    }
                })
        })
    }

    //queries db to see all roles
    viewAllRoles(){
        db.query("SELECT roles.id, title, FORMAT(salary, 2) AS salary, department_id, departments.name AS department_name FROM roles JOIN departments ON roles.department_id = departments.id", (err, res) => {
            if(err){
                console.log(err);
            }
            if(!err){
                console.table(res)
            }
            inquirer
                .prompt(questions.advQs)
                .then(res => {
                    if(res.advancer.toLowerCase() === "y"){
                        this.starter()
                    }else{
                        return;
                    }
                })
        })
        
        

    }

    // will take the user input and insert into the database a new department
    addDept(){
        inquirer
            .prompt(questions.addDeptQs)
            .then(response => {
                db.query("INSERT INTO departments(name) VALUES (?)", response.dept, (err, res) => {
                    if(err){
                        console.log(err);
                    }
                    if(!err){
                        console.log(response)
                        
                    }

                    if(response.advancer.toLowerCase() === "y"){
                        this.starter();
                    } else{
                        return;
                    }
                })
            });

        
            
    }

    //will take the user input and construct a new item to add into the roles table
    addRole(){
        inquirer
            .prompt(questions.addRoleQs)
            .then(response => {
                let deptId;
                deptArr.forEach(item => {
                    if(response.dept === item.name){
                        deptId = item.id
                    }
                })
                let insertArr = [response.title, numFix(response.salary), deptId]
                db.query("INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)", insertArr, (err, res) => {
                    if(err){
                        console.log(err);
                    }
                    if(!err){
                        console.log(response)
                    }
                    if(response.advancer.toLowerCase() === "y"){
                        this.starter();
                    } else{
                        return;
                    }
                })
            })
    }

    // will take the user input and insert the new employee into the employee table with all of their details
    addEmployee(){
        inquirer
            .prompt(questions.addEmployeeQs)
            .then(response => {
                let roleID;
                rolesArr.forEach(item => {
                    if(item.title === response.role){
                        roleID = item.id
                    }
                })
                let managerId;
                if(!response.managerId){
                    let insertArr = [response.firstName, response.lastName, roleID]
                    db.query("INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?)", insertArr, (err, res) => {
                        if(err){
                            console.log(err)
                        }
                        if(!err){
                            console.log(response)
                        }
                        if(response.advancer.toLowerCase() === "y"){
                            this.starter();
                        } else{
                            return;
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
                            console.log(response)
                        }
                        if(response.advancer.toLowerCase() === "y"){
                            this.starter();
                        } else{
                            return;
                        }
                    })
                }
                
               
            })
    }

    // will take the user input to update an existing item from each table
    updateEmployeeRole(){
        inquirer 
            .prompt(questions.updateQs)
            .then(response => {
                switch (response.action){
                    case "First Name":
                        db.query("UPDATE employee SET first_name = ? WHERE id = ?", [response.firstName, parseFloat(response.employee)], (err, res) => {
                            if(err) console.log(err);
                            if(!err){
                                console.log(res)
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    case "Last Name":
                        db.query("UPDATE employee SET last_name = ? WHERE id = ?", [response.lastName, parseFloat(response.employee)], (err, res) => {
                            if(err) console.log(err);
                            if(!err){
                                console.log(res)
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    case "Role":
                        let roleID;
                        rolesArr.forEach(item => {
                            if(item.title === response.roleChange){
                                roleID = item.id;
                            }
                            
                        })
                        db.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, parseFloat(response.employee)], (err, res) => {
                            if(err) console.log(err);
                            if(!err){
                                console.log(res)
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    case "Manager": 
                        db.query("UPDATE employee SET manager_id = ? WHERE id = ?", [parseFloat(response.managerChange), parseFloat(response.employee)], (err, res) => {
                            if(err) console.log(err);
                            if(!err){
                                console.log(res)
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    default:
                        break;

                }
            })
    }

    // will take the user input to delete an existing item from each of the tables
    deleteItem(){
        inquirer
            .prompt(questions.deleteQs)
            .then(response => {
                switch (response.delChoice){
                    case "Employees":
                        db.query("DELETE FROM employee WHERE id = ?", parseFloat(response.delEmp), (err, res) => {
                            if(err){
                                console.log(err)
                            }
                            if(!err){
                                console.log(res)
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    case "Roles":
                        db.query("DELETE FROM roles WHERE title = ?", response.delRole, (err, res) => {
                            if(err){
                                console.log(err);
                            }
                            if(!err){
                                console.log(res);
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })
                        break;
                    case "Departments":
                        db.query("DELETE FROM departments WHERE name = ?", response.delDept, (err, res) => {
                            if(err){
                                console.log(err)
                            }
                            if(!err){
                                console.log(res);
                            }
                            if(response.advancer.toLowerCase() === "y"){
                                this.starter();
                            } else{
                                return;
                            }
                        })

                }
            })
    }
}


var startIt = new Questions;

startIt.starter();

