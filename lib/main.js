/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var core = require("./core.js");
var extend = require("./extend.js");

/* ========================================================= ***/
/** ===================== INIT AND CLONE ==================== **/
/*** ========================================================= */

//INIT THE MODULE WITH YOU SUNLIGHT FUNDATION KEY
module.exports.init = function(opts){
    var optsType = typeof opts;
    if(optsType == "string"){
	   core.apikey = opts; 
    }
    else if(optsType == "object"){
        if(opts.key==undefined && core.apikey == undefined){
            throw new Error("Must provide an api key");
        }
        else{
            core.apiUrl = opts.url || "https://congress.api.sunlightfoundation.com/";
            core.apikey = opts.key;
        }
    }
    else{
        throw new Error("Must call init with either api key or a config object");
    }
}

module.exports.status = function(cb, fail){
    var obj = extend(true, {}, core);
    obj.collection = undefined;
    obj.call(cb, fail);
}

//CLONE ANY OBJECT YOU WISH TO
module.exports.clone = function(obj){
    return extend(true, {}, obj);
}

/* ========================================================= ***/
/** ========================= ENDPOINTS ===================== **/
/*** ========================================================= */

/* =============================================== **
** DOCS: http://sunlightlabs.github.com/congress/  **
** =============================================== */

//Roll call votes in Congress, back to 2009. Updated within minutes of votes.
module.exports.votes = function(){

	var obj = extend(true, {}, core);
	obj.collection = "votes";

	return obj;
}

//Committee hearings in Congress. Updated as hearings are announced.
module.exports.hearings = function(){

	var obj = extend(true, {}, core);
	obj.collection = "hearings";

	return obj;
}

//To-the-minute updates from the floor of the House and Senate.
module.exports.floorUpdates = function(){

	var obj = extend(true, {}, core);
	obj.collection = "floor_updates";

	return obj;
}

//Legislation in the House and Senate, back to 2009. Updated daily.
module.exports.bills  = function(){

	var obj = extend(true, {}, core);
	obj.collection = "bills";

	return obj;
}

//Full text search over legislation.
module.exports.billsSearch  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "bills/search";

    obj.highlight = function(){
    
        if(typeof this.queryObj == "undefined"){
            throw Error("SEARCH MUST BE CALLED BEFORE HIGHLIGHT IF HIGHLIGHT IS TO BE USED");
        }

        if(arguments.length==2){
            this.filter("highlight.tags", arguments[0]+","+arguments[1]);
        }

        return this.filter("highlight", true);
    }

    return obj;
}

module.exports.amendments = function(){

    var obj = extend(true, {}, core);
    obj.collection = "amendments";

    return obj;
}

//Current legislators' names, IDs, biography, and social media.
module.exports.legislators  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "legislators";

    return obj;
}

//Find representatives and senators for a latitude/longitude or zip.
module.exports.legislatorsLocate  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "legislators/locate";

    return obj;
}

//Find congressional districts for a latitude/longitude or zip
module.exports.districtsLocate  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "districts/locate";

    return obj;
}

//Current committees, subcommittees, and their membership.
module.exports.committees  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "committees";

    return obj;
}

//Bills scheduled for debate in the future, as announced by party leadership.
module.exports.upcomingBills  = function(){

    var obj = extend(true, {}, core);
    obj.collection = "upcoming_bills";

    return obj;
}