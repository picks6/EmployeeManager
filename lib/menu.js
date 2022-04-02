const inquirer = require("inquirer");
const cTable = require("console.table");

//Require the helpers folder to run all of the functions
const {
  employeeGet,
  employeeQuery,
  getManagerId,
  employeeRole,
  employeeManager,
  employeeDelete,
} = require("../helpers/employee");
const {
  rolesGet,
  roleCreate,
  roleDelete,
} = require("../helpers/role");
const {
  selectDept,
  departmentGet,
  departmentCreate,
  departmentDelete,
  departmentId,
} = require("../helpers/department");

// Main menu where all options are selected
const mainMenu = {
  type: "list",
  message: "Please make a selection",
  name: "continue",
  choices: [
    "View All Employees",
    "Add Employee",
    "View Employees By Manager",
    "View Employees By Department",
    "Update Employee Role",
    "Update Employee Manager",
    "Delete Employee",
    "View All Departments",
    "View Department Budget",
    "Add Department",
    "Delete Department",
    "Add Role",
    "View All Roles",
    "Delete Role",
    "End",
  ],
};

// Main Menu
class menu {
  menuSelect(response) {
    if (response.continue === "View All Employees") {
      this.viewAllEmployees();
    }else if (response.continue === "Add Employee") {
      this.addEmployee();
    } else if (response.continue === "Update Employee Role") {
      this.updateEmployeeRole();
    } else if (response.continue === "Update Employee Manager") {
      this.updateEmployeeManager();
    } else if (response.continue === "View Employees By Manager") {
      this.viewEmployeeByManager();
    } else if (response.continue === "Delete Employee") {
      this.employeeDelete();
    } else if (response.continue === "View All Roles") {
      this.viewAllRoles();
    } else if (response.continue === "Add Role") {
      this.addRole();
    } else if (response.continue === "View All Departments") {
      this.viewAllDepartments();
    } else if (response.continue === "Add Department") {
      this.addDepartment();
    } else if (response.continue === "Delete Role") {
      this.roleDelete();
    } else if (response.continue === "Delete Department") {
      this.deleteDepartment();
    } else if (response.continue === "View Employees By Department") {
      this.viewEmployeeByDepartment();
    } else if (response.continue === "View Department Budget") {
      this.viewDepartmentBudget();
    } else if (response.continue === "End") {
      return;
    }
  }

  // Start Function - is called after every function to return to the main menu
  start() { 
    inquirer.prompt([mainMenu]).then((response) => {
      this.menuSelect(response);
    });
  }

//View All Employees
  async viewAllEmployees() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });

    const [rows, fields] = await db.execute("SELECT * FROM employee");
    console.log("\n");
    console.table(rows);
    console.log("\n");
    if (rows.length) {
      this.start();
    }
  }

// All Employees by Department
  async viewEmployeeByDepartment() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });


    const departmentArray = [];
    departmentGet().then((result) => {
      result.forEach((row) => departmentArray.push(row["name"]));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Please select a department",
            name: "dept",
            choices: departmentArray,
          },
        ])
        .then((response) => {
          departmentId(response.dept).then(async (dId) => {
            // Used Join in order to get only the Employee information from the department chosen
            const [rows, fields] = await db.execute(
              `SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id FROM employee e JOIN role r ON e.role_id = r.id WHERE department_id = '${dId}'`
            );
            console.log("\n");
            console.table(rows);
            if (rows.length) {
              this.start();
            } 
          });
        });
    });
  }

//View Employee by Manager  
  async viewEmployeeByManager() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });


    const managerArray = [];
    employeeGet().then((result) => {
      result.forEach((row) =>
        managerArray.push(`${row["first_name"]} ${row["last_name"]}`)
      );

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which manager's employees would you like to view?",
            name: "manager",
            choices: managerArray,
          },
        ])

        .then(async (response) => {
          if (response.manager.split(" ")[0] === "No") {
            const [rows, fields] = await db.execute(
              `SELECT * FROM employee WHERE manager_id = null`
            );
            console.log("\n");
            console.table(rows);
            if (rows.length) {
              this.start();
            } else {
              console.log("There are 0 employees with no manager");
              this.start();
            }
          } else {
            getManagerId(
              response.manager.split(" ")[0],
              response.manager.split(" ")[0]
            ).then(async (mId) => {
              const [rows, fields] = await db.execute(
                `SELECT * FROM employee WHERE manager_id = '${mId}'`
              );
              console.log("\n");
              console.table(rows);
              if (rows.length) {
                this.start();
              } else {
                console.log(
                  `There are no employees with ${response.manager} as their manager.`
                );
                this.start();
              }
            });
          }
        });
    });
  }

  addEmployee() {
    // Again getting the arrays before the prompt
    const roleArray = [];
    rolesGet().then((result) =>
      result.forEach((row) => roleArray.push(row["title"]))
    );

    const managerArray = [];
    employeeGet().then((result) =>
      result.forEach((row) => {
        managerArray.push(`${row["first_name"]} ${row["last_name"]}`);
      })
    );

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "last_name",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "role",
          choices: roleArray,
        },
        {
          type: "list",
          message: "What is the employee's manager?",
          name: "manager",
          choices: managerArray,
        },
      ])
      .then((response) => {
        employeeQuery(response).then(this.start());
      });
  }

//update employees role

  updateEmployeeRole() {
    const empArr = [];
    const roleArray = [];
    employeeGet().then((result) => {
      result.forEach((row) => {
        empArr.push(`${row["first_name"]} ${row["last_name"]}`);
      });
      rolesGet().then((result) => {
        result.forEach((row) => roleArray.push(row["title"]));

        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee's role would you like to update?",
              name: "emp",
              choices: empArr,
            },
            {
              type: "list",
              message: "What is the new role?",
              name: "role",
              choices: roleArray,
            },
          ])
          .then((response) => {
            employeeRole(response).then(this.start());
          });
      });
    });
  }

//update employee manager 
  
  updateEmployeeManager() {
    const employeeUpdate = [];
    const managerUpdate = [];
    employeeGet().then((result) => {
      result.forEach((row) => {
        employeeUpdate.push(`${row["first_name"]} ${row["last_name"]}`);
        managerUpdate.push(`${row["first_name"]} ${row["last_name"]}`);
      });

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's manager would you like to update?",
            name: "emp",
            choices: employeeUpdate,
          },
          {
            type: "list",
            message: "Who will be this employee's manager?",
            name: "manager",
            choices: managerUpdate,
          },
        ])
        .then((response) => {
          employeeManager(response).then(this.start());
        });
    });
  }

//employeeDelete

  employeeDelete() {
    const employeeUpdate = [];
    employeeGet().then((result) => {
      result.forEach((row) => {
        employeeUpdate.push(`${row["first_name"]} ${row["last_name"]}`);
      });

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee will be deleted?",
            name: "emp",
            choices: employeeUpdate,
          },
        ])
        .then((response) => {
          employeeDelete(response).then(this.start());
        });
    });
  }


 //view roles

  async viewAllRoles() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });

    const [rows, fields] = await db.execute("SELECT * FROM role");
    console.log("\n");
    console.table(rows);
    console.log("\n");
    if (rows.length) {
      this.start();
    }
  }

 //add new role

  addRole() {
    const departmentArray = [];
    departmentGet().then((result) => {
      result.forEach((row) => departmentArray.push(row["name"]));

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is role name?",
            name: "name",
          },
          {
            type: "input",
            message: "What is the role salary",
            name: "salary",
          },
          {
            type: "list",
            message: "Please select department",
            name: "dept",
            choices: departmentArray,
          },
        ])
        .then((response) => {
          roleCreate(response).then(this.start());
        });
    });
  }

//role Delete

  roleDelete() {
    const roleArray = [];
    rolesGet().then((result) => {
      result.forEach((row) => roleArray.push(row["title"]));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which role will be deleted?",
            name: "role",
            choices: roleArray,
          },
        ])
        .then((response) => {
          roleDelete(response).then(this.start());
        });
    });
  }

//view all departments

  async viewAllDepartments() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });

    const [rows, fields] = await db.execute("SELECT * FROM department");
    console.log("\n");
    console.table(rows);
    console.log("\n");
    if (rows.length) {
      this.start();
    }
  }

//add department 
  
  addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter new department name",
          name: "dept",
        },
      ])
      .then((response) => {
        departmentCreate(response).then(this.start());
      });
  }

//delete department
  
  deleteDepartment() {
    const departmentArray = [];
    departmentGet().then((result) => {
      result.forEach((row) => departmentArray.push(row["name"]));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which department will be deleted?",
            name: "dept",
            choices: departmentArray,
          },
        ])
        .then((response) => {
          departmentDelete(response).then(this.start());
        });
    });
  }

//department budget function - group by

  async viewDepartmentBudget() {
    const mysql = require("mysql2/promise");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });

    const departmentArray = [];
    departmentGet().then((result) => {
      result.forEach((row) => departmentArray.push(row["name"]));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Please select department",
            name: "dept",
            choices: departmentArray,
          },
        ])
        .then((response) => {
          departmentId(response.dept).then(async (dId) => {
            const [rows, fields] = await db.execute(
              `SELECT SUM(r.salary) as ${response.dept}_salary FROM employee e JOIN role r ON e.role_id = r.id WHERE department_id = '${dId}'`
            );
            console.log("\n");
            console.table(rows);
            if (rows.length) {
              this.start();
            } 
          });
        });
    });
  }
}

module.exports = menu;