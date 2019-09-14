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
    console.log("Welcome toa Bamazon for Supervisors!");
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
    var query = "SELECT departments.id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) FROM products RIGHT JOIN departments ON departments.id = products.id";

    connection.query(query, function(err, res) {
        if(err) throw err;
        output = [];

        res.forEach(element => {
            output.push(element.id);
            data.push(output);
        });

        console.log(table(data));
        
    });
}