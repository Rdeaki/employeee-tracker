INSERT INTO department (name)
VALUES
('Finance'),
('Engineering'),
('Sales'),
('Legal'),

INSERT INTO role (title, salary, department_id)
VALUES
('LeadAccount', 200000, 3),
('Accountant', 120000, 3),
('Head Engineer', 190000, 2),
('Software Engineer', 500000, 2),
('Sales Lead', 120000, 1),
('Sales person', 80000, 1),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('potter', 'harry', 1, null),
('Cyrus', 'Billy', 2, 1),
('Downey', 'Robert', 3, null),
('Barack', 'Obama', 4, 3),
('Smith', 'will', 5, null),
('gates', 'Malone', 6, 5),
('Hofflebrof', 'David', 7, null),
('Bidney', 'Sydney', 8, 7);