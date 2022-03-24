INSERT INTO department (name)
VALUES
  ('Executive'),
  ('Sales'),
  ('Operations'),
  ('Finance'),
  ('Legal'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
  ('CEO', '1000000', 1),
  ('Sales VP', '500000', 2),
  ('Sales Manager', '200000', 2),
  ('Salesperson', '100000', 2),
  ('COO', '500000', 3),
  ('Ops Manager', '100000', 3),
  ('Forklift Operator', '200000', 3),
  ('CFO', '500000', 4),
  ('Finance Manager', '200000', 4),
  ('Financial Analyst', '100000', 4),
  ('General Counsel', '500000', 5),
  ('Intern', '50000', 5),
  ('CPO', '500000', 6),
  ('HR Person', '100000', 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Alex', 'Ovechkin', 1, NULL),
  ('Nic', 'Backstrom', 2, 1),
  ('Nic', 'Dowd', 3, 2),
  ('Lars', 'Eller', 4, 3),
  ('Carl', 'Hagelin', 4, 3),
  ('Garnet', 'Hathaway', 5, 1),
  ('Marcus', 'Johansson', 6, 6),
  ('Axel', 'Jonsson-Fjallby', 7, 7),
  ('Evgeny', 'Kuznetsov', 7, 7),
  ('Johan', 'Larsson', 8, 1),
  ('Anthony', 'Mantha', 9, 10),
  ('TJ', 'Oshie', 10, 11),
  ('Conor', 'McMichael', 10, 11),
  ('Tom', 'Wilson', 11, 1),
  ('Joe', 'Snively', 12, 14),
  ('Conor', 'Sheary', 12, 14),
  ('John', 'Carlson', 13, 1),
  ('Michael', 'Kempny', 14, 17),
  ('Dmitry', 'Orlov', 14, 17);
  
