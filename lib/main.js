/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var core = require("./core.js");
var extend = require("./extend.js");

/* ========================================================= ***/
/** ===================== INIT AND CLONE ==================== **/
/*** ========================================================= */

//INIT THE MODULE WITH YOU SUNLIGHT FUNDATION KEY
module.exports.init = function(slk){
	core.apikey = slk;
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
module.exports.votes = function(slk){

	var obj = extend(true, {}, core);
	obj.setKey(slk);
	obj.collection = "votes";

	return obj;
}

//Committee hearings in Congress. Updated as hearings are announced.
module.exports.hearings = function(slk){

	var obj = extend(true, {}, core);
	obj.setKey(slk);
	obj.collection = "hearings";

	return obj;
}

//To-the-minute updates from the floor of the House and Senate.
module.exports.floorUpdates = function(slk){

	var obj = extend(true, {}, core);
	obj.setKey(slk);
	obj.collection = "floor_updates";

	return obj;
}

//Legislation in the House and Senate, back to 2009. Updated daily.
module.exports.bills  = function(slk){

	var obj = extend(true, {}, core);
	obj.setKey(slk);
	obj.collection = "bills";

	return obj;
}

//Full text search over legislation.
module.exports.billsSearch  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
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

//Current legislators' names, IDs, biography, and social media.
module.exports.legislators  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
    obj.collection = "legislators";

    return obj;
}

//Find representatives and senators for a latitude/longitude or zip.
module.exports.legislatorsLocate  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
    obj.collection = "legislators/locate";

    return obj;
}

//Find congressional districts for a latitude/longitude or zip
module.exports.districtsLocate  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
    obj.collection = "districts/locate";

    return obj;
}

//Current committees, subcommittees, and their membership.
module.exports.committees  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
    obj.collection = "committees";

    return obj;
}

//Bills scheduled for debate in the future, as announced by party leadership.
module.exports.upcomingBills  = function(slk){

    var obj = extend(true, {}, core);
    obj.setKey(slk);
    obj.collection = "upcoming_bills";

    return obj;
}