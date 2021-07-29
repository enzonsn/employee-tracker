DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

INSERT INTO department (name) 
VALUES ('Top'), ('Pres'), ('Direct'), ('Bottom');

CREATE TABLE position (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dep_id INT NOT NULL
);

INSERT INTO position (title, salary, dep_id)
VALUES
    ('CEO', 1000000, 1),
    ('COO', 900000, 1),
    ('President', 800000, 2),
    ('Vice Presidnet', 750000, 2),
    ('Director', 250000, 3),
    ('Assistant Director',100000, 3),
    ('Employee', 80000, 4),
    ('Intern', 50000, 4);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Corinne', 'Axl', 1, 0),
    ('Lorna', 'Silas', 2, 1),
    ('Madelne', 'Dex', 3, 0),
    ('Frederick', 'Homer', 4, 3),
    ('Lovell', 'Alden', 5, 0),
    ('Tom', 'Shana', 6, 5),
    ('Alva', 'Clifton', 7, 5),
    ('Benji', 'Kyro', 8, 5);