var sca = require("../lib/main");

var success = function(data){
	console.log(data);
}

sca.init("APIKEYYYYYYYYYYYYYYYYYYYYYY");

sca.votes().filter("year", "2012").call(success);
