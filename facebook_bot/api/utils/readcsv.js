var Converter = require("csvtojson").Converter;


function readcsv(filename, callback) {
    var converter = new Converter({});
    converter.on("end_parsed", function(jsonArray) {
        callback(jsonArray);
    });
    require("fs").createReadStream(filename).pipe(converter);
}

module.exports = {
	readcsv : readcsv,
}