# Sunlight Congress API Wrapper


A `node.js` wrapper for the [Sunlight Congress API](http://sunlightlabs.github.com/congress/) from [Sunlight Labs](http://sunlightlabs.com/).

## Usage

	var sca = require("../lib/main");

	var success = function(data){
		console.log(data);
	}

	sca.init("APIKEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

	sca.votes().filter("year", "2012").call(success);

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
