USE employee_db;

INSERT INTO department (name) 
VALUES ('Top'), ('Pres'), ('Direct'), ('Bottom');

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

INSERT INTO employee (first_name, last_name, pos_id, manager_id)
VALUES
    ('Corinne', 'Axl', 1, NULL),
    ('Lorna', 'Silas', 2, 1),
    ('Madelne', 'Dex', 3, NULL),
    ('Frederick', 'Homer', 4, 2),
    ('Lovell', 'Alden', 5, NULL),
    ('Tom', 'Shana', 6, 3),
    ('Alva', 'Clifton', 7, 4),
    ('Benji', 'Kyro', 8, 5);