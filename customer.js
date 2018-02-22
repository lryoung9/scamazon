// Open the Command Terminal and execute the following:
	// npm install mysql
	// npm install inquirer

// Needed to prompt user for input
var inquirer = require("inquirer");

// Require mysql to read and maniplate the product database:
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "scamazon"
});

// function to validate user inputs a number for the quantity prompt
function validateQty(qty)
{
		if (isNaN(qty)) {
			return "Please enter a number for the quantity."
		};
}

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT item_id, product_name, price FROM products", function (err, result, fields) {
    if (err) throw err;
    // create a temporary array to store products from result
    var prodArray = [];
    // loop through to fill array
    for (var i = 0; i < result.length; i++) {
    	prodArray.push({name: result[i].product_name + ": $" + result[i].price, value: result[i].item_id})
		}

		inquirer.prompt([
			{
		   	message: "Press [SPACE] to select an item to add to your cart.",
		   	type: "checkbox",
		   	name: "products",
		   	pageSize: prodArray.length,
		   	choices: prodArray,
		   }
		]).then(function(answers) {
			var count = 0;
			// temporary object to hold user input for quantity of each cart item
			var productQuantity = [];
			askProductQuantity();

			function askProductQuantity() {
				if (count < answers.products.length) {
					inquirer.prompt([
					{
						message: `Verify the quantity to order: ${answers.products[count]}`,
						name: "qty",
						type: "input",
						validate: validateQty,
						default: 1
					}]).then(function(quantity) {
						connection.query("SELECT stock_quantity FROM products WHERE item_id =?", (answers.products[count].value), function (err, res) {
				    	if (err) throw err;
						});

						console.log(quantity)
						productQuantity[answers.products[count]] = parseInt(quantity.qty);
						count++;
						askProductQuantity();
					});
				} else {
					console.log("Your cart item(s):")
					console.log(productQuantity)
				}
				
			}
		});
	});
})