const { deptNames, roleNames, managerNames, employeeNames, } = require("./queries");
const startQs = [
    {
        "type": "list",
        "name": "action",
        "message": "Choose which of these you would like to do next.",
        "choices": ["View all departments", "View all employees", "View all roles", "Add a department", "Add a role", "Add an employee", "Update employee role"]
    }
]

const addDeptQs = [
    {
        "name": "dept",
        "message": "Enter the name of the department you would like to add.",
        validate: dept => {
            if(dept.trim() === ""){
                return "Please make a valid entry."
            }
            return true 
        }
    },
    {
        "name": "advancer",
        "message": "Are there any more actions you would like to preform on your database? y/n",
        validate: advancer => {
            if(advancer.trim() === "" || !['y', 'Y', "N", 'n'].includes(advancer)){
                return "Enter y for yes and n for no"
            }
            return true 
        }
    }
]

const addRoleQs = [
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
        
    },
    {
        "name": "advancer",
        "message": "Are there any more actions you would like to preform on your database? y/n",
        validate: advancer => {
            if(advancer.trim() === "" || !['y', 'Y', "N", 'n'].includes(advancer)){
                return "Enter y for yes and n for no"
            }
            return true 
        }
    }
] 


const addEmployeeQs = [
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
    },
    {
        "name": "advancer",
        "message": "Are there any more actions you would like to preform on your database? y/n",
        validate: advancer => {
            if(advancer.trim() === "" || !['y', 'Y', "N", 'n'].includes(advancer)){
                return "Enter y for yes and n for no"
            }
            return true 
        }
    }
]


const updateQs = [
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
        "choices": ["First Name", "Last Name", "Role", "Manager", "Salary"]
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
        "type": "list",
        "name": "managerChange",
        "message": "Choose the employee's new manager",
        "choices": managerNames,
        when: answers => {
            return answers.action === "Manager"
        }
    },
    {
        "name": "advancer",
        "message": "Are there any more actions you would like to preform on your database? y/n",
        validate: advancer => {
            if(advancer.trim() === "" || !['y', 'Y', "N", 'n'].includes(advancer)){
                return "Enter y for yes and n for no"
            }
            return true 
        }
    }

]

const advQs = [
    {
        "name": "advancer",
        "message": "Are there any more actions you would like to preform on your database? y/n",
        validate: advancer => {
            if(advancer.trim() === "" || !['y', 'Y', "N", 'n'].includes(advancer)){
                return "Enter y for yes and n for no"
            }
            return true 
        }
    }
]

module.exports = {
    startQs, 
    addDeptQs, 
    addRoleQs, 
    addEmployeeQs, 
    updateQs,
    advQs
}