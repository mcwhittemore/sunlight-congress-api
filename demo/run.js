var rtc = require("../lib/main");

var good = function(data){
	console.log(data);
}

rtc.init("APIKEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

rtc.votes().filter("year", "2012").call(good);
