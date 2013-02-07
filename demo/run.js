var rtc = require("../lib/main");

var success = function(data){
	console.log(data);
}

rtc.init("APIKEYYYYYYYYYYYYYYYYYYYYYY");

rtc.votes().filter("year", "2012").call(success);
