# Sunlight Congress API Wrapper

A `node.js` wrapper for the [Sunlight Congress API](http://sunlightlabs.github.com/congress/) from [Sunlight Labs](http://sunlightlabs.com/).

# Installing


	npm install sunlight-congress-api


## Usage

	var sca = require("../lib/main");

	var success = function(data){
		console.log(data);
	}

	sca.init("APIKEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

	sca.votes().filter("year", "2012").call(success);

## Demo

A small demo is provided. After creating a config.js file, run `node run.js` in the demo folder to try it out.

## API

### Endpoints

There are currently 10 endpoints to the SCApi.

* bills: `sca.bills()` provides info on legislation in the House and Senate, back to 2009. Updated daily.
* bills/search: `sca.billsSearch()` does a full text search over legislation.
* committees: `sca.committees()` lists current committees, subcommittees, and their membership.
* districts/locate: `sca.districtsLocate()` finds congressional districts for a latitude/longitude or zip.
* floor_updates: `sca.floorUpdates()` lists up-to-the-minute updates from the floor of the House and Senate.
* hearings:	`sca.hearings()` lists committee hearings in Congress. Updated as hearings are announced.
* legislators: `sca.legislators()` brings up current legislators' names, IDs, biography, and social media.
* legislators/locate: `sca.leislatorsLocate()` finds representatives and senators for a latitude/longitude or zip.
* upcoming_bills: `sca.upcomingBills()` lists bills scheduled for debate in the future, as announced by party leadership.
* votes: `sca.votes()` provide access to roll call votes in Congress, back to 2009. Updated within minutes of votes.

### Standard Calls

#### filter(field, value, [operator])

Adds query parmeter to quests. Allows for chaining.

	sca.votes().filter("year", "2012"); //get all votes with year 2012

* field: this is the field you want to filter on.
* value: the value the field must eval to, to be returned.
* operator: how to perform the eval. Defaults to =.
	* = - the field is equal to the value (default).
	* gt - the field is greater than this value
	* gte - the fiels is greater than or equal to this value
 	* lt - the field is less than this value
	* lte - the field is less than or equal to this value
	* not - the field is not this value
	* all - the field is an array that contains all of these values (separated by "|")
	* in - the field is a string that is one of these values (separated by "|")
	* nin - the field is a string that is not one of these values (separated by "|")
	* exists - the field is both present and non-null (supply "true" or "false")

#### page(pagenumber, [pagesize])

Provides control over the pages SCApi returns to you.

	sca.votes().page(2, 5); //return page 2 of votes where the pagesize is 5 items.

* pagenumber: which page to have returned.
* pagesize: how many items to return on a page. Defaults to 20. Max is 50.

#### fields(field1, field2, ..., fieldN)

Provides control over which fields to have SCApi return to you. This is very helpful, as the API returns default fields only if this is not used.

This function takes any number of arguments. Each argument will be added the request string.

	sca.votes().fields("year", "chamber") //returns the YEAR and CHAMBER fields from votes

#### order(field, [direction])

Provides control over the ordering of results. This is vital to pagination returns. 

	sca.votes().order("year", "desc"); //orders the result of votes by year from newest to oldest

If you want to multiorder a call, use the order function twice.

	//orders the results by chamber from a to z and then by year from newest to oldest.
	sca.votes().order("chamber", "asc").order("year");

* field: which field to sort by.
* direction: how to direct. Two options, desc and asc. Defaults to desc.

#### call(success, [failure])

Issues GET request to the API. Async calls success on success and failure on failure. If failure is not defined, a default console.log is used.
