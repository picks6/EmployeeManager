const inquirer = require("inquirer");
const cTable = require("console.table");

const {departmentId} = require("../helpers/department");

async function selectRole() {
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
  console.log("\n\n\n\n\n\n\n");
}

async function rolesGet() {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [roleArray, fields] = await db.execute("SELECT id, title FROM role");
  return roleArray;
}

async function getRoleId(role) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [id, fields] = await db.execute(
    `SELECT id FROM role WHERE title = '${role}'`
  );
  return id[0]["id"];
}

async function roleCreate(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  departmentId(response.dept).then((dId) => {
    db.execute(
      `INSERT INTO role(title, salary, department_id) VALUES('${response.name}', '${response.salary}', '${dId}')`
    );
  });
  return response;
}

async function roleDelete(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  getRoleId(response.role).then((rId) => {
    db.execute(`DELETE FROM role WHERE id = '${rId}'`);
  });
  return;
}

module.exports = {selectRole, rolesGet, getRoleId, roleCreate, roleDelete};
