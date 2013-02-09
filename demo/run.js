var api = require("../lib/main");
var config = require("./config");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
	throw new Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}

//RESULTS MIGHT NOT COME BACK IN THE ORDER WE REQUESTED THEM, THESE FUNCTIONS WILL HELP US KNOW WHICH IS WHICH
var successVotes = function(data){
	console.log("*************************************************************************");
	console.log("******************************* VOTES ***********************************");
	console.log("*************************************************************************");
	console.log(data);
	console.log("*************************************************************************");
	console.log("*************************************************************************");
	console.log();
}

var successNutrition = function(data){
	console.log("*************************************************************************");
	console.log("****************************** NUTRITION *********************************");
	console.log("*************************************************************************");
	console.log(data);
	console.log("*************************************************************************");
	console.log("*************************************************************************");
	console.log();
}

var successCorn = function(data){
	console.log("*************************************************************************");
	console.log("******************************** CORN ***********************************");
	console.log("*************************************************************************");
	console.log(data);
	console.log("*************************************************************************");
	console.log("*************************************************************************");
	console.log();
}

//INIT THE MASTER MODULE
api.init(config.apikey);

/*
//CREATE A VOTES MODULE, DEFINE IT, CALL IT
api.votes() // We are going to call the votes endpoint
	.filter("year", "2012") //limit results to votes from 2012
	.page(1, 5) //request the first page, with 10 results per page
	.fields("chamber", "vote_type", "question") //set fields to select
	.order("chamber", "desc") //order the results by chamber field ascending	
	.fields("voted_at") //add another field to select
	.order(["voted_at", "asc"], ["year", "desc"]) //also set up order via a list of arrays
	.order({field: "vote_type", direction:"asc"}, {field: "question", direction:"desc"}) //also add to order via a list of objects
	.call(successVotes); //issue request and have results be passed to "success" on a successful completion
*/

//CREATE A BILL SEARCH MODULE, DEFINE IT
var base_search = api.billsSearch(); //Create a billSearch endpoint object and save it to base_search.
base_search.page(1, 5); //limit results to 5
base_search.filter("introduced_on", "2012-01-01", "gte"); //filter results to bills introduced on or after 1/1/2012
base_search.filter("introduced_on", "2012-12-31", "lte"); //filter results to bills introduced on or before 12/31/2012
base_search.filter("enacted_as.law_type", "public"); //filter results to bills that went into public law.
base_search.fields("official_title", "introduced_on", "last_vote_at", "summary");

//CREATE A BILL SEARCH MODULE, DEFINED LIKE base_search, LIMITED TO BILLS ABOUT CHILD NUTRITION
var nutritionBills = api.clone(base_search).search('"child nutrition*"~d10'); 
console.log(nutritionBills.getEndpoint());
//nutritionBills.call(successNutrition);

/*
//CREATE A BILL SEARCH MODULE, DEFINED LIKE base_search, LIMITED TO BILLS ABOUT NUTRITION
var cornBills = api.clone(base_search).search("corn");
cornBills.call(successCorn);

*/
