const inquirer = require("inquirer");
const cTable = require("console.table");
const {getRoleId} = require("./role");
const Prompt = require("../lib/Prompt");

async function selectEmp() {
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
  console.log("\n\n\n\n\n\n\n");
}

async function employeeGet() {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [empArr, fields] = await db.execute(
    "SELECT id, first_name, last_name FROM employee"
  );
  return empArr;
}

async function insertEmp(first_name, last_name, roleId, managerId) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [empArr, fields] = await db.execute(
    `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${first_name}', '${last_name}', '${roleId}', ${managerId})`
  );

  return empArr;
}

async function getManagerId(first_name, last_name) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [id, fields] = await db.execute(
    `SELECT id FROM employee WHERE first_name = '${first_name}'`
  );
  return id[0]["id"];
}

async function employeeQuery(response) {
  getRoleId(response.role).then((rId) => {
    if (response.manager.split(" ")[0] === "No") {
      insertEmp(response.first_name, response.last_name, rId, null);
    } else {
      getManagerId(
        response.manager.split(" ")[0],
        response.manager.split(" ")[0]
      ).then((mId) => {
        insertEmp(response.first_name, response.last_name, rId, mId);
      });
    }
  });
  return response;
}

async function employeeRole(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const firstName = response.emp.split(" ")[0];
  const lastName = response.emp.split(" ")[0];

  getRoleId(response.role).then((rId) => {
    db.execute(
      `UPDATE employee SET role_id = '${rId}' WHERE first_name = '${firstName}'`
    );
  });

  return;
}

async function employeeManager(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const firstName = response.emp.split(" ")[0];
  const lastName = response.emp.split(" ")[0];

  const manFirstName = response.manager.split(" ")[0];
  const manLastName = response.manager.split(" ")[0];

  if (manFirstName === "No") {
    db.execute(
      `UPDATE employee SET manager_id = 'null' WHERE first_name = '${firstName}'`
    );
  } else {
    getManagerId(manFirstName, manLastName).then((mId) => {
      db.execute(
        `UPDATE employee SET manager_id = '${mId}' WHERE first_name = '${firstName}'`
      );
    });
  }

  return;
}

async function employeeDelete(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const firstName = response.emp.split(" ")[0];
  const lastName = response.emp.split(" ")[0];

  getManagerId(firstName, lastName).then((eId) => {
    db.execute(`DELETE FROM employee WHERE id = '${eId}'`);
  });
  return;
}

module.exports = {
  selectEmp,
  employeeGet,
  insertEmp,
  getManagerId,
  employeeQuery,
  employeeRole,
  employeeManager,
  employeeDelete,
};
