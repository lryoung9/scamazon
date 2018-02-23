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

// stores cart items
var cart = [];
// stores product name
var productName;
// stores product price
var productPrice;
var productQty;
var cartTotal = 0;


// function to update product totals
function total(x, y) {
	return x * y;
	cartTotal += total(x, y);
}

function askProductQuantity(answers, count) {
				if (count <= answers.products.length - 1) {
					inquirer.prompt([
					{
						message: `Verify the quantity to order of ${answers.products[count]}:`,
						name: "qty",
						type: "input",
						// validate: validateQty,
						default: 1
					}]).then(function(quantity) {
						productName = answers.products[count].split(':')[0];
						productPrice = parseFloat(answers.products[count].split(': $')[1]);
						productQty = quantity.qty;
						con.query("SELECT stock_quantity FROM products WHERE product_name=?", productName, function (err, res) {
				    	if (err) throw err;
				    	// if quantity > stock_quantity, tell user "Not enough product in inventory"
				    	if (quantity.qty > res[0].stock_quantity) {
				    		console.log("Sorry. Not enough stock to fufill your order.")
				    		return;
				    	}
				    	// else update database stock_quantity and give user total cost
				    	else {
				    		con.query("UPDATE products SET stock_quantity = ? WHERE product_name=?", [(res[0].stock_quantity - quantity.qty), productName]);
				    		cart.push(`${quantity.qty} of ${productName}`);
				    	}
				    	cartTotal += total(productPrice, productQty);
				    	count++;
				    	askProductQuantity(answers, count);
						});
					});
				} else {
					console.log("Your cart item(s):")
					console.log(cart);
					console.log(`Total: $${cartTotal}`)
				}
				
			}

// function to give user total

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, result, fields) {
    if (err) throw err;
    // create a temporary array to store products from result
    var prodArray = [];
    // loop through to fill array
    for (var i = 0; i < result.length; i++) {
    	prodArray.push({name: result[i].product_name + ": $" + result[i].price, id: result[i].item_id})
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
			askProductQuantity(answers, count);
			//console.log(prodArray)
		});
	});
})