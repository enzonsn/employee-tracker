var mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect((err) => {
    if(err) throw err;
    start();
});

function start(){
    inquirer.prompt({
        type: 'list',
        message: 'What would you like?',
        name: 'action',
        choices: [
            'View', 'Add', 'Delete', "Change employee's position", 'Quit'
        ]
    }).then(function(choice){
        switch(choice.action){
            case 'View': viewPg(); break;
            case 'Add' : addPg(); break;
            case 'Delete': deletePg(); break;
            case "Change employee's position": changePosition(); break;
            case 'Quit': connection.end(); break;
        }
    });
}

function viewPg(){
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to view?',
        name: 'action',
        choices: [
            'View departments', 'View positions', 'View employees',
            'View employees by department', 'Back'
        ]
    }).then(function(choice){
        switch(choice.action){
            case 'View departments': viewDepartments(); break;
            case 'View positions': viewPositions(); break;
            case 'View employees': viewEmployees(); break;
            case 'View employees by department': viewEmpDep(); break;
            case 'Back': start(); break;
        }
    });
}

function addPg(){
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to add?',
        name: 'action',
        choices: [
            'Add a department', 'Add a position', 'Add an employee', 'Back'
        ]
    }).then(function(choice){
        switch(choice.action){
            case 'Add a department': createDepartment(); break;
            case 'Add a position': createPosition(); break;
            case 'Add an employee': createEmployee(); break;
            case 'Back': start(); break;
        }
    });
}

function deletePg(){
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to delete?',
        name: 'action',
        choices: [
            'Delete a department', 'Delete a position', 'Delete an employee', 'Back'
        ]
    }).then(function(choice){
        switch(choice.action){
            case 'Delete a department': deleteDep(); break;
            case 'Delete a position': deletePos(); break;
            case 'Delete an employee': deleteEmp(); break;
            case 'Back': start(); break;
        }
    });
}

function viewEmployees(){
    connection.query(`SELECT employee.id AS id, 
     CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name, 
     department.name AS department, 
     position.title AS title, 
     CONCAT('$', FORMAT(position.salary, 0)) AS salary, 
     employee.manager_id AS manager 
     FROM employee 
     LEFT JOIN position ON employee.role_id = position.id 
     LEFT JOIN department ON position.dep_id = department.id;`, 
     function(err, res){
        if(err) throw err
        console.table(res);
        start(); 
    })
}

function viewPositions(){
    var query = 'SELECT * FROM position';
    connection.query(query, function(err, res){
        if(err) throw err;
        console.table(res);
        start();
    })
}

function viewDepartments(){
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res){
        if(err) throw err;
        console.table(res);
        start();
    })
}

function viewEmpDep(){
    connection.query('SELECT * FROM department', function(err, res) { 
        if(err) throw err
        inquirer.prompt(
            { type: 'list', message: 'What department would you like to view?', name: 'dep_name', 
                choices: function(){
                    var depArr = res.map(function(res){return res['name'];});
                    return depArr;
            }}
        ).then(function(answer){
            let dep = res.find(department => department.name === answer.dep_name);
            connection.query(
            `SELECT employee.id AS id,
            CONCAT(employee.first_name, " ", employee.last_name) AS employee_name,
            department.name AS department, position.title AS position
            FROM employee 
            LEFT JOIN position ON position.id = employee.role_id
            LEFT JOIN department ON department.id = position.dep_id
            WHERE ?
            `, { dep_id: dep.id},
            function(err, res){ if (err) throw err
                console.table(res);
                start();
            });
        });
    });
}

function createDepartment(){
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'department'
    }).then(function(answer){
        connection.query('INSERT INTO department SET ?', {
            name: answer.department
        }, function(err, res){ 
            if(err) throw err;
            console.log('New department has been created!');
            start();
        });
    });
}

function createPosition(){
    connection.query('SELECT * FROM department', function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            { type: 'input', message: 'What is the position you are adding?', name: 'title' },
            { type: 'input', message: 'What is the salary?', name: 'salary' },
            { type: 'list', message: 'What is the department it is in?', name: 'dep_name', 
                choices: function(){
                    var depArr = res.map(function(res){return res['name'];});
                    return depArr;
            }}
        ]).then(function(answer){
            let dep = res.find(department => department.name === answer.dep_name);
            connection.query('INSERT INTO position SET ?', {
                title: answer.title, dep_id: dep.id, salary: answer.salary
            }, function(err, res){ 
                if(err) throw err; 
                console.log('New role has been created!');
                start();
            });
        });
    });
}

function createEmployee(){
    connection.query('SELECT * FROM position', function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            { type: 'input', message: 'First name: ', name: 'first_name' },
            { type: 'input', message: 'Last name: ', name: 'last_name' },
            { type: 'input', message: "What is their manager's id?", name: 'manager_id' },
            { type: 'list', message: 'What is the role of the employee?', name: 'role',
                choices: function(){
                    var roleArr = res.map(function(res){return res['title'];});
                    return roleArr;
                }}
        ]).then(function(answer){
            let role = res.find(position => position.title === answer.role);
            connection.query('INSERT INTO employee SET ?', {
                first_name: answer.first_name, last_name: answer.last_name, manager_id: answer.manager_id, role_id: role.id 
            }, function(err, res){ 
                if(err) throw err;
                console.log('New employee has been added!'); 
                start();
            });
        });
    });
}

function changePosition(){
    let employeesList = [];
    connection.query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employeeName FROM employee;',
        function(err, res){ if(err) throw err 
            employeesList = res.map(function (res){return res['employeeName'];});
        });
    connection.query('SELECT position.title FROM position', function(err, res){ if(err) throw err
        inquirer.prompt([
        {   
            type: 'list', message: 'Which employee?',
            name: 'full_name', choices: employeesList
        },
        { 
            type: 'list', message: 'What is the new role of the employee?', name: 'new_role',
            choices: function(){
                var roleArr = res.map(function(res){return res['title'];});
                return roleArr;
            }
        }
        ]).then(function(answers){
            connection.query('SELECT * FROM position', function(err, res){
                if(err) throw err
                let newRole = res.find(position => position.title === answers.new_role); 
                connection.query('SELECT * FROM employee', function(err, res){
                    if(err) throw err
                    let employeeFullName = answers.full_name.split(' ');
                    const newEmployee = res.find(employee => employee.first_name === employeeFullName[0] && employee.last_name === employeeFullName[1]);
                    
                    connection.query('UPDATE employee SET ? WHERE ?',
                        [
                            {role_id: newRole.id},
                            {id: newEmployee.id}
                        ] 
                    , function(err, res){
                        if(err) throw err
                        console.log('You have changed the role of an employee!');
                        start();
                    });
                });
            });
        });
    });
}

function deleteDep(){
    connection.query('SELECT * FROM department', function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            { type: 'list', message: 'What department would you like to remove?', name: 'dep_name', 
                choices: function(){
                    var depArr = res.map(function(res){return res['name'];});
                    return depArr;
            }}
        ]).then(function(answer){
            let dep = res.find(department => department.name === answer.dep_name);
            connection.query('DELETE FROM department WHERE ?', { id: dep.id }, 
            function(err, res){ if (err) throw err
                console.log('You have deleted a department!');
                start();
            })

        });
    });
}

function deletePos(){
    connection.query('SELECT * FROM position', function(err, res) {
        if(err) throw err;
        inquirer.prompt([
            { type: 'list', message: 'What role would you like to remove?', name: 'role_name', 
                choices: function(){
                    var roleArr = res.map(function(res){return res['title'];});
                    return roleArr;
            }}
        ]).then(function(answer){
            let role = res.find(position => position.title === answer.role_name);
            connection.query('DELETE FROM position WHERE ?', { id: role.id }, 
            function(err, res){ if (err) throw err
                console.log('You have deleted a position!');
                start();
            });
        });
    });
}

function deleteEmp(){
    let employeeList = [];
    connection.query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employeeName FROM employee;',
    function(err, res){ if(err) throw err
        employeeList = res.map(function (res){return res['employeeName'];});
        inquirer.prompt(
            { type: 'list', message: 'Which employee would you like to remove?', 
            name: 'terminate', choices: employeeList}
        ).then(function(answer){
            connection.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name FROM employee;', 
            function(err, res){ if (err) throw err
                let employeeFullName = answer.terminate.split(' ');
                const newEmployee = res.find(employee => employee.first_name === employeeFullName[0] && employee.last_name === employeeFullName[1]);
                connection.query('DELETE FROM employee WHERE ?;',  { id: newEmployee.id }, 
                function(err, res){ if (err) throw err
                    console.log('You have deleted an employee!');
                    start();
                });
            });
        });
    });
}
