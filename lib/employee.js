
searchEmployee = (connection) => {
    return new Promise(function(resolve, reject){
        connection.query(
            `SELECT
                employee.emp_id AS id, 
                CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name,
                department.name AS department, 
                position.title AS title,
                CONCAT('$', FORMAT(position.salary, 0)) AS salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            INNER JOIN position ON employee.pos_id = position.pos_id
            INNER JOIN department ON position.dep_id = department.dep_id
            LEFT JOIN employee manager ON manager.manager_id = employee.manager_id;
            `,
            function(err, res){ 
                if(err){return reject(err);} 
                resolve(res); 
            }
        );
    });
}