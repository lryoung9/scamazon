// Open the Command Terminal and execute the following:
	// npm install mysql
	// npm install inquirer

// Needed to prompt user for input
var inquirer = require("inquirer");

// Require mysql to read and maniplate the product database:
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "scamazon"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT product_name, price FROM products", function (err, result, fields) {
    if (err) throw err;
    // create a temporary array to store products from result
    var prodArray = [];
    // loop through to fill array
    for (var i = 0; i < result.length; i++) {
    	prodArray.push(result[i].product_name + ": $" + result[i].price);
	}
	
	inquirer.prompt([
		{
	    	message: "Press <space> to select an item to add to your cart.",
	    	type: "checkbox",
	    	name: "products",
	    	choices: prodArray
	    }
	]).then(answer)
	;

  });
});

