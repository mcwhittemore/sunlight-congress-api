var sca = require("../lib/main");
var config = require("./config");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
	throw new Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}

var success = function(data){
	console.log(data);
}

sca.init(config.apikey);

sca.votes().filter("year", "2012").call(success);
