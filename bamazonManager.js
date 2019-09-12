var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!Ezekiel21",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to Bamazon for Managers!");
    startProgram();
});

function startProgram() {
    inquirer.prompt([{
        name: "actions",
        message: "What would you like to do?",
        type: "rawlist",
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"]
    }]).then(function (answer) {
        switch (answer.actions) {
            case "View products for sale":
                viewProducts();
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addProduct();
                break;
            case "Exit":
                connection.end();
        }
    });
}

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        res.forEach(function (product) {
            console.log(product.id + ".) " + product.name + " || Price: $" + product.price + " || Stock available: " + product.stock);
        });
        startProgram();
    });
}

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("The following products have an inventory count of less than 5;");
        res.forEach(function (product) {
            console.log(product.id + ".) " + product.name + " || Stock available: " + product.stock);
        });
        startProgram();
    });
}

function addInventory() {
    inquirer.prompt([{
            name: "product",
            type: "input",
            message: "Which product would to like to add inventory to?",
            validate: function (value) {
                if (isNaN(value)) {
                    return console.log("Please select a valid index");
                }
                return true;
            }
        },
        {
            name: "amount",
            type: "input",
            message: "How much would you like to add?",
            validate: function (value) {
                if (isNaN(value)) {
                    return console.log("Please select a valid index");
                }
                return true;
            }
        }
    ]).then(function (answer) {
        connection.query(`UPDATE products SET stock = stock + "${answer.amount}" WHERE id = "${answer.product}"`, function (err, res) {
            if (err) throw err;
            console.log(answer.amount + " unit(s) added to Product ID: " + answer.product);
            startProgram();
        });
    });
}

function addProduct() {
     
}