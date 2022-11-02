const inquirer = require('inquirer')
const cTable = require('console.table');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log(chalk.red.bold(`=================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employe Tracker')));
    console.log(``);
    console.log(chalk.red.bold(`=================================================================================`));
    promptUser();
});

const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;

    console.log(chalk.red.bold(`====================================================================================`));
    console.log(``);
    console.log(chalk.blueBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(chalk.red.bold(`====================================================================================`));

    promptUser();
});

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Select your choice',
            choices: actions
        }
    ])
    .then(({ answer }) => {

        if (answer === actions[0]) {displayDepts();}
        if (answer === actions[1]) {displayRoles();}
        if (answer === actions[2]) {displayEmployees();}
        if (answer === actions[3]) {addDept();}
        if (answer === actions[4]) {addRole();}
        if (answer === actions[5]) {addEmp();}
        if (answer === actions[6]) {updateEmp();}
        if (answer === actions[7]) {removeEmp();}

    })
};

const moreActions = () => {
    inquirer.prompt([{
        type: 'confirm',
        message: 'would you like to start any other actions?',
        name: 'moreActions',
        default: false
    }]).then(({moreActions}) => {
        if (moreActions) {
            return promptUser()
        } db.end()
    })
};

// display all departments
const displayDepts = () => {
    const query = db.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err;
        }

        //displays table

        console.log('\n');
        console.table(res);
        console.log('-------------------------------------')

        moreActions();
    });
};

// display all roles
const displayRoles = () => {
    const query = db.query('SELECT roles.id, roles.title, roles.salary, department.name as department_name FROM roles LEFT JOIN department on roles.department_id = department.id;', (err, res) => {
        if (err) {
            throw err;
        }
        //display table
        console.table(res);
        console.log('-------------------------------------')

        return moreActions();
    });
};

// display employee

const displayEmployees = () => {
    console.log('view all employees');
    const query = db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title as job_title, roles.salary, department.name as deparment, employee.manager_id FROM employee LEFT JOIN roles on employee.role_id = roles.id INNER JOIN department on roles.department_id = department.id', (err, res) => {
        if (err) {
            throw err;
        } console.table(res)
        console.log('-------------------------------------')
        moreActions();
    });
};

// add a department
const addDept = () => {
    return inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Select a department you would like to add'
    },
    ])
    .then((answer) => {
        console.log(answer.name);
        db.query(
            'INSERT INTO department SET ?',
            {name: answer.name},
            (err, res) => {
                if (err) {
                    throw err
                }
                console.table(res);
                moreActions();
            }
        )
    })
};

// add a role
const addRole = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;

        let departmentChoices = res.map(department => ({
            name: department.name, value: department.id
        }));

        // prompt for questions
        inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'enter a role you would like to add'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter a salary for selected role'
        },
        {
            type: 'list',
            name: 'department',
            choices: departmentChoices,
            message: 'Choose a department for the role you just created'
        }
        ])
        .then((answer) => {
            console.log(answer.title)
            db.query(
                'INSERT INTO roles SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department
                },
                (err, res) => {
                    if (err) {
                        throw err
                    }
                    console.table(res);
                    moreActions();
                }
            )
        })
    })
};

// add a employee
const addEmp = () => {
    db.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;

        let roleList = res.map(roles => ({
            name: roles.title, value: roles.id
        }));
        // prompt question
        inquirer.prompt([{
            type: 'input',
            name: 'first_name',
            message: 'Enter the employees first name'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employees last name'
        },
        {
            type: 'list',
            name: 'role',
            choices: roleList,
            message: 'Enter the employees job title'
        }
        ])
        .then((answer) => {
            db.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role
                },
                (err, res) => {
                    if (err) {
                        throw err
                    }
                    console.table(res);
                    moreActions();
                }
            )
        })
    });
};

// update an employee
const updateEmp = () => {
    db.query(
        'SELECT CONCAT(employee.first_name, " ",employee.last_name) AS full_name, employee.id as empl_id, roles.* FROM employee RIGHT JOIN roles on employee.role_id = roles.id',
        function (err, res) {
            if (err) throw err;

            let employeeList = res.map(employee => ({
                full_name: employee.full_name,
                id:employee.empl_id,
                value:[employee.full_name, employee.empl_id]
            }))
            let roleList = res.map (roles => ({
                title: roles.title,
                id: roles.id,
                value:[roles.title,roles.id]
            }));
            console.log(employeeList)
            inquirer.prompt([{
                type:'list',
                name:'employee',
                choices:employeeList,
                message:'Which employee would you like to edit?'
            },
            {
            type:'list',
            name:'newRole',
            choices:roleList,
            message:'What role do you want to assign?'
        }
        ])
            .then((answer) => {
                let editID = answer.employee[1];
                let newRoleId = answer.newRole[1];
                db.query(`UPDATE employee SET role_id=${newRoleId} WHERE id=${editID};`,
                (err, res) => {
                    if(err) {
                        throw err
                    }
                    console.table(res)
                    moreActions();
                })
            })
    })
};

// remove an employee
const removeEmp = () => {
    db.query('SELECT CONCAT(first_name, " ", last_name) as full_name, id FROM employee', function (err, res) {
        if (err) throw err;

        let employeeList = res.map(employee => ({
            full_name: employee.full_name,
            id: employee.id,
            value: [employee.full_name, employee.id]
        }));
        inquirer.prompt([{
            type: 'list',
            name: 'employee',
            choices: employeeList,
            message: 'Select the employee you would like to remove'
        }
        ])
            .then((answer) => {
                deleteID = answer.employee[1];
                db.query(`DELETE FROM employee WHERE id = ${deleteID};`,
                    (err, res) => {
                        if (err) {
                            throw err
                        }
                        console.table(res);
                        moreActions();
                    }
                )
            });
    });
};