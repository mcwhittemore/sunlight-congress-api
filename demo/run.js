var sca = require("../lib/main");
var config = require("./config");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
	throw new Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}

var success = function(data){
	console.log(data);
}

sca.init(config.apikey);

sca.billsSearch().query("test");


sca.votes() // We are going to call the votes endpoint
	.filter("year", "2012") //limit results to votes from 2012
	.page(1, 20) //request the first page, with 10 results per page
	.fields("chamber", "vote_type", "question") //set fields to select
	.order("chamber", "desc") //order the results by chamber field ascending	
	.fields("voted_at") //add another field to select
	.order(["voted_at", "asc"], ["year", "desc"]) //also set up order via a list of arrays
	.order({field: "vote_type", direction:"asc"}, {field: "question", direction:"desc"}) //also add to order via a list of objects
	.call(success); //issue request and have results be passed to "success" on a successfull completion
