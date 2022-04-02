const inquirer = require("inquirer");
const cTable = require("console.table");


async function selectDept() {
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
  console.log("\n\n\n\n\n\n\n");
}

async function departmentGet() {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [departmentArray, fields] = await db.execute("SELECT id, name FROM department");
  return departmentArray;
}

async function departmentId(name) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [id, fields] = await db.execute(
    `SELECT id FROM department WHERE name = '${name}'`
  );
  return id[0]["id"];
}

async function departmentCreate(response) {
  const mysql = require("mysql2/promise");

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ShinyPsyduck",
    database: "employee_db",
  });

  const [departmentArray, fields] = await db.execute(
    `INSERT INTO department(name) VALUES('${response.dept}')`
  );

  return departmentArray;
}

async function departmentDelete(response) {
    const mysql = require("mysql2/promise");
  
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "ShinyPsyduck",
      database: "employee_db",
    });
  
    departmentId(response.dept).then((dId) => {
      db.execute(`DELETE FROM department WHERE id = '${dId}'`);
    });
    return;
  }

module.exports = {selectDept, departmentGet, departmentCreate, departmentId, departmentDelete};
