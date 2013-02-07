# Real Time Congress Wrapper


A `node.js` wrapper for the [Real Time Congress API](http://services.sunlightlabs.com/docs/Real_Time_Congress_API/) from [Sunlight Labs](http://sunlightlabs.com/).

## Usage

	var rtc = require("../lib/main");

	var success = function(data){
		console.log(data);
	}

	rtc.init("APIKEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

	rtc.votes().filter("year", "2012").call(success);

## Main Ideas

The Real Time Congress APU (RTCA) is divided up into 
