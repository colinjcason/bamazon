var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!Ezekiel21",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;
    showProducts();
});

function showProducts() {
    var query = "SELECT id, name, price FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        console.log("Welcome to Bamazon for customers!\nHere is the list of items available for purchase: ");
        for(var i = 0; i < res.length; i++) {
            console.log(res[i].id + ".) " + res[i].name + " || Price: " + res[i].price);
        }

        startProgram();
    });
}

function startProgram() {           
    inquirer.prompt([
        {
            name: "id",
            message: "Which product would you like to buy?",
            type: "input",
            validate: function(value) {
                if(isNaN(value)) {
                    return console.log("\nPlease enter a valid index");
                }
                return true;
            }
        },
        {
            name: "quantity",
            message: "How many would you like to buy?",
            type: "input",
            validate: function(value) {
                if(isNaN(value)) {
                    return console.log("\nPlease enter a number");
                }
                return true;
            }
        }
    ]).then(function(answer) {
        connection.query(`SELECT id, name, stock, price FROM products WHERE id = "${answer.id}"`, function(err, res) {
            if(err) throw err;

            console.log(res[0].name);
        });
      

    });
}