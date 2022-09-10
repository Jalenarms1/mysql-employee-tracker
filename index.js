const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");


class Questions {
    constructor(){}

    starter(){
        inquirer
            .prompt([
                {
                    "type": "list",
                    "name": "action",
                    "message": "Choose which of these you would like to do next.",
                    "choices": ["View all departments", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role"],
                    

                }
            ])
            .then(res => {
                if(res.action === "View all departments"){
                    this.viewAllDept();
                }
            })
    }

    viewAllDept(){
        
    }
}

var startIt = new Questions;

startIt.starter();