var sca = require("../lib/main");
var config = require("./config");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
	throw new Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}

var success = function(data){
	console.log(data);
}

sca.init(config.apikey);

sca.votes() // We are going to call the votes endpoint
	.filter("year", "2012") //limit results to votes from 2012
	.page(1, 3) //request the first page, with 10 results per page
	.fields("chamber", "vote_type", "question") //set fields to select
	.order("chamber", "desc") //order the results by chamber field ascending
	.fields("voted_at") //add another field to select
	.order("voted_at", "asc") //also order by voted_at
	.call(success); //issue request and have results be passed to "success" on a successfull completion
