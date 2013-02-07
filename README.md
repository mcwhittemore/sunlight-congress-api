# Sunlight Congress API Wrapper


A `node.js` wrapper for the [Sunlight Congress API](http://sunlightlabs.github.com/congress/) from [Sunlight Labs](http://sunlightlabs.com/).

## Usage

	var sca = require("../lib/main");

	var success = function(data){
		console.log(data);
	}

	sca.init("APIKEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

	sca.votes().filter("year", "2012").call(success);
