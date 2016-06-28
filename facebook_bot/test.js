var csv = require("./api/utils/readcsv");

csv.readcsv("../files/bot.csv", function(result){
	console.log(result);
});