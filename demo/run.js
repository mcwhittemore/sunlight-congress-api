var api = require("../lib/main");
var config = require("./config");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
	throw Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}

// RESULTS MIGHT NOT COME BACK IN THE ORDER WE REQUESTED THEM
// THIS FUNCTION WILL HELP US KNOW WHICH IS WHICH BY CREATING
// A STANDARD HEADER ROW SUCCESS FUNCTION WITH A LABEL
var buildSuccess = function(title){
	return function(data){
		console.log("\n**************************** "+title+" ***********************************");
		console.log(data);
		console.log();
	}
}

// INIT THE MASTER MODULE
api.init(config.apikey);


// CREATE A VOTES MODULE, DEFINE IT, CALL IT
// EXAMPLE RESPONSE: ./results/Votes.json
api.votes() // We are going to call the votes endpoint
	.filter("year", "2012") //limit results to votes from 2012
	.page(1, 5) //request the first page, with 10 results per page
	.fields("chamber", "vote_type", "question") //set fields to select
	.order("chamber", "desc") //order the results by chamber field ascending	
	.fields("voted_at") //add another field to select
	.order(["voted_at", "asc"], ["year", "desc"]) //also set up order via a list of arrays
	.order({field: "vote_type", direction:"asc"}, {field: "question", direction:"desc"}) //also add to order via a list of objects
	.call(buildSuccess("VOTES")); //issue request and have results be passed to "success" on a successful completion


// CREATE A BILL SEARCH MODULE, DEFINE IT, CALL IT
// EXAMPLE RESPONSE: ./results/NutritionBills.json
var nutritionBills = api.billsSearch(); //Create a billSearch endpoint object and save it to nutritionBills.
nutritionBills.page(1, 1); //limit results to 5
nutritionBills.filter("introduced_on", "2012-01-01", "gte"); //filter results to bills introduced on or after 1/1/2012
nutritionBills.filter("introduced_on", "2012-12-31", "lte"); //filter results to bills introduced on or before 12/31/2012
nutritionBills.filter("enacted_as.law_type", "public"); //filter results to bills that went into public law.
nutritionBills.fields("official_title", "introduced_on", "last_vote_at");
nutritionBills.search("\"child nutrition\"~10");
nutritionBills.highlight("<span style='color:red;'>", "</span>"); //highlight where search results happened.
nutritionBills.call(buildSuccess("NUTRITION"));

// TO DEBUG HOW SUNLIGHT UNDERSTANDS YOUR REQUEST, USE EXPLIAN
// EXAMPLE RESPONSE: ./results/NutritionBillsExplain.json
nutritionBills.explain().call(buildSuccess("EXPLAIN NUTRITION"));


// IF YOU NEED TO HAVE TWO ENDPOINTS WITH ALMOST IDENTICAL PARAMETERS USE CLONE

var senatorsPage1 = api.legislators()
							.filter("in_office", true)
							.filter("chamber", "senate")
							.fields("first_name", "middle_name", "last_name", "twitter_id", "gender")
							.fields("party", "term_start", "state", "state_rank")
							.page(1, 5); //this might make more sense at 50... but it just fills up the demo screen

var senatorsPage2 = api.clone(senatorsPage1)
							.page(2);

// EXAMPLE RESPONSE: ./results/SenatorsPage1.json
senatorsPage1.call(buildSuccess("SENTORS PAGE 1"));
// EXAMPLE RESPONSE: ./results/SenatorsPage2.json
senatorsPage2.call(buildSuccess("SENTORS PAGE 2"));

// TO STEP THROUGH A SET OF PAGES, USE NEXT.
var committees = api.committees();
for(var i=1; i<5; i++){
	committees.next(buildSuccess("COMMITTEESS PAGE "+i));
}
