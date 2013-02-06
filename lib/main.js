
//GLOBAL VARS
var basepoint = "http://api.realtimecongress.org/api/v1/";
var format = "json";
var sunlightkey = undefined;

//INIT THE MODULE WITH YOU SUNLIGHT FUNDATION KEY
module.exports.init = function(slk){
	sunlightkey = slk;
}


//END POINTS
module.exports.votes = function(prams, callback, failure){
	return call("votes", {}, callback, failure);
}

module.exports.documents = function(prams, callback, failure){
	return call("documents", {}, callback, failure);
}

module.exports.committeeHearings = function(prams, callback, failure){
	return call("committee_hearings", {}, callback, failure);
}

module.exports.floorUpdates = function(prams, callback, failure){
	return call("floor_updates", {}, callback, failure);
}

module.exports.videos = function(prams, callback, failure){
	return call("videos", {}, callback, failure);
}

module.exports.amendments = function(prams, callback, failure){
	return call("amendments", {}, callback, failure);
}

module.exports.bills = function(prams, callback, failure){
	return call("bills", {}, callback, failure);
}



//CALL OUT TO RESORCE
var call = function(collection, prams){
	keyCheck();
	var endpoint = basepoint+collection+"."+format+"?apikey="+sunlightkey;
	console.log(endpoint);
}

var callSync = function(){

}

var callAsync = function(){
	
}


//CONFIRM THAT THE APIKEY HAS BEEN SET
var keyCheck = function(){
	if(sunlightkey==undefined){
		throw new Error("YOU MUST USE INIT TO DEFINE YOUR SUNLIGHT FONDATION API KEY!");
	}
}


//IF A FAILURE CALLBACK IS NOT SUPPLIED, THIS WILL BE CALLED
var failedCall = function(){

}