var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!Ezekiel21",
    database: "bamazon"    
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Welcome to Bamazon for Supervisors!");
    startProgram();
});

function startProgram() {
    inquirer.prompt([
        {
            name: "actions",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View product sales by department", "Create new department", "Exit"]
        }
    ]).then(function(answer) {
        switch(answer.actions) {
            case "View product sales by department":
                viewSales();
                break;
            case "Create new department":
                createDept();
                break;
            case "Exit":
                connection.end();
        }
    });
}

function viewSales() {
    var data = [["Department ID", "Department Name", "Overhead Costs", "Total Sales", "Total Profit"]];
    var query = "SELECT departments.id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS total_sales FROM products RIGHT JOIN departments ON products.department = departments.department_name GROUP BY department";

    connection.query(query, function(err, res) {
        if(err) throw err;
        res.forEach(function(info) {
            output = [];
            output.push(info.id);
            output.push(info.department_name);
            output.push(info.overhead_costs);
            output.push(info.total_sales);
            output.push(info.total_sales - info.overhead_costs);
            data.push(output);
        });        
        console.log(table(data));
        startProgram();
    });
}

function createDept() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        },
        {
            name: "cost",
            type: "input",
            message: "What is the overhead costs of the new department?"
        }
    ]).then(function(answer) {
        var query = `INSERT INTO departments (department_name, overhead_costs) VALUES ("${answer.name}", "${answer.cost}")`;
        connection.query(query, function(err, res) {
            if(err) throw err;
            console.log(answer.name + " successfully created!");
            startProgram();
        });
    });
}