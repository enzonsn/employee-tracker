DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
    dep_id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (dep_id),
    UNIQUE (name)
);

CREATE TABLE position(
    pos_id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dep_id INT NOT NULL,
    PRIMARY KEY (pos_id),
    FOREIGN KEY (department_id) REFERENCES department(dep_id) ON DELETE CASCADE,
    CONSTRAINT uq_pos UNIQUE (title, department_id)
);

CREATE TABLE employee(
    emp_id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    pos_id INT NOT NULL,
    manager_id INT REFERENCES id,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (position_id) REFERENCES position(pos_id) ON DELETE CASCADE,
    CONSTRAINT uq_emp UNIQUE (first_name, last_name, pos_id, manager_id)
);

