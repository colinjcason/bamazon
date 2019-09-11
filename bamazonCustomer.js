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
    showProducts();
});

function showProducts() {
    var query = "SELECT id, name, price FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Welcome to Bamazon for customers!\nHere is the list of items available for purchase: ");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + ".) " + res[i].name + " || Price: " + res[i].price);
        }

        startProgram();
    });
}

function startProgram() {
    inquirer.prompt([{
            name: "id",
            message: "Which product would you like to buy?",
            type: "input",
            validate: function (value) {
                if (isNaN(value)) {
                    return console.log("\nPlease enter a valid index");
                }
                return true;
            }
        },
        {
            name: "quantity",
            message: "How many would you like to buy?",
            type: "input",
            validate: function (value) {
                if (isNaN(value)) {
                    return console.log("\nPlease enter a number");
                }
                return true;
            }
        }
    ]).then(function (answer) {
        buyProduct(answer.id, answer.quantity);
    });
}

function buyProduct(id, quantity) {
    connection.query(`SELECT id, name, stock, price FROM products WHERE id = "${id}"`, function (err, res) {
        if (err) throw err;

        var productName = res[0].name;
        var price = res[0].price;
        var stock = res[0].stock;

        if (quantity > stock) {
            console.log("Sorry! We don't have that many " + productName + "(s) in stock!\nPlease request a smaller amount.");
            startProgram();
        } else {
            connection.query("UPDATE products SET ? WHERE ?",
                [{
                        stock: stock - quantity
                    },
                    {
                        name: productName
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log("You purchased " + quantity + " " + productName + "(s) " + "for $" + (price * quantity) + "!");
        shopAgain();

                });
        };
    });
}

function shopAgain() {
    inquirer.prompt([
        {
            name: "shop",
            message: "Would you like to shop some more?",
            type: "confirm",
            default: true
        }
    ]).then(function(answer) {
        if(answer.shop === true) {
            showProducts();            
        }
        else {
            connection.end();            
        }
    });
}