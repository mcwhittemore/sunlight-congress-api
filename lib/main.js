/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var http = require("http");


/* ========================================================= ***/
/** ================= ENDPOINT WIDE FUNCTIONS =============== **/
/*** ========================================================= */

//simular to SQL LIMIT
var page = function(num, qty){
    if(typeof qty != "undefined"){
        return this.filter("per_page", qty).filter("page", num);
    }
    else{
        return this.filter("page", num);
    }
}

//simular to SQL ORDER BY
var order = function(field, dir){

    if(arguments.length<0){
        throw new Error("MUST SUPPLY AT LEAST ONE ARGUMENT TO SELECT");
    }
    
    if(typeof field === "string"){

        if(typeof dir == "undefined"){
            dir = "desc";
        }

        dir = dir.toLowerCase();

        if(dir!="desc"&&dir!="asc"){
            throw new Error("ORDER DIRECTION CAN MUST BE desc or asc");
        }

        return this.filter("order", field+"__"+dir);
    }
    else {
        for(var i=0; i<arguments.length; i++){

            var arg = arguments[i];     

            var field = "";
            var direction = "";

            if(Object.prototype.toString.call( arg ) == '[object Array]'){
                field = arg[0];
                direction = arg[1];
            }
            else if(Object.prototype.toString.call( arg ) == '[object Object]'){
                field = arg.field;
                direction = arg.direction;
            }
            else{
                throw new Error("INVALID ARGUMENT ON ORDER");
            }

            this.filter("order", field+"__"+direction);

        }
        return this;
    }

}

var fields = function(){
    if(arguments.length<0){
        throw new Error("MUST SUPPLY AT LEAST ONE ARGUMENT TO SELECT");
    }

    for(var i=0; i<arguments.length; i++){
        this.filter("fields", arguments[i]);
    }

    return this;
}


/* =================================================================== */

//Global add parms function, also used directly to currate the where clause
var filter = function(field, value, operator){

    if(typeof operator != "undefined" && operator != "="){
        if(field!="order"){
            operatorCheck(operator);
            field = field+"__"+operator;
        }
        else if(operator=="asc"||operator=="desc"){
            value = value+"__"+operator;
        }
        else{
            throw new Error("("+operator+") is not a valid operator for "+field);
        }
    }

    //UNSET A FILTER
    if(value==null && typeof this.queryObj[field] != "undefined"){
        this.queryObj[field] = undefined;
    }
    //ADD TO A LIST FILTER
    else if(field=="fields"||field=="order"){
        var list = [];

        if(typeof this.queryObj[field] != "undefined"){
            list = this.queryObj[field];
        }

        list[list.length] = value;

        this.queryObj[field] = list;
    }
    //SET/OVERWRITE A SIMPLE FILTER
    else{
        this.queryObj[field] = value;
    }
	
	return this;
}

//CONFIRM THAT THE OPERATOR IS VALID
var operatorCheck = function(operator){
    if(false){
        throw new Error("NEED ERROR MESSAGE");
    }
}

//CALL OUT TO THE API
var call = function(callback, fail){
	keyCheck(this.apikey);

    //passed object
    if(typeof callback == "object"){
        fail = callback.fail;
        callback = callback.callback;
    }

    //passed a new callback function
    if(typeof callback != "undefined"){
        this.success = callback;
    }
    //didn't pass a new call back function, use old one
    else if(typeof this.success != "undefined"){
        callback = this.success;
    }
    //AH! no callback
    else{
        throw new Error("YOU MUST DEFINED A SUCCESS FUNTION BEFORE PERFORMING CALL");
    }

    //passed a new failure function
	if(typeof failure != "undefined"){
		this.failure = fail;
	}
    //didn't pass a new failure function
    else if(typeof this.failure != "undefined"){
        fail = this.failure;
    }
    //AH! no failure function. Lets fail! HA!
    else{
        throw new Error("YOU MUST DEFINED A FAILRE FUNTION BEFORE PERFORMING CALL");
    }

    this.query = queryString(this.queryObj);
    var endpoint = basepoint+this.collection+"/?apikey="+this.apikey+this.query

    //console.log(endpoint);
	
	http.get(endpoint, function(res){
		var data = "";
		res.on("data", function(chunk){
			data+=chunk;
		});
		res.on("end", function(){
            data = JSON.parse(data);
            data.status = "success";
            data.error = undefined;
			callback(data);
		})
	}).on("error", function(e){
        var data = {
            status: "error",
            error: e,
            results: []
        }
        fail(data);
    });
}

var setKey = function(key){
    if(typeof key != "undefined"){
        this.apikey = key;
    }
}

/* ========================================================= ***/
/** ==================== BASIC OBJECT DATA ================== **/
/*** ========================================================= */

var basepoint = "http://congress.api.sunlightfoundation.com/";
var baseObj = {

    //BASE DATA
	apikey : undefined,
	collection: "",
	query: "",
    queryObj: {}, //used to stage 

    //CORE FUNCTIONS
	call: call,
	setKey: setKey,
	filter: filter,
    page: page,
    order: order,
    fields: fields,

    //CALLBACK FUNCTIONS
    success: undefined,
    failure: function(data){
        console.log("ERROR: "+data.error.message);
    }
}

/* ========================================================= ***/
/** ==================== BACKEND UTILITIES ================== **/
/*** ========================================================= */

//CONFIRM THAT THE APIKEY HAS BEEN SET
var keyCheck = function(key){
    if(key==undefined){
        throw new Error("YOU MUST USE INIT TO DEFINE YOUR SUNLIGHT FONDATION API KEY!");
    }
}

var queryString = function(query){
    var baseuri = "";
    var keys = Object.keys(query);

    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        var value = query[key];
        baseuri += "&"+key+"="+value;
    }

    return baseuri;
}

/* ========================================================= ***/
/** ====================== THE GRAND INIT =================== **/
/*** ========================================================= */

//INIT THE MODULE WITH YOU SUNLIGHT FUNDATION KEY
module.exports.init = function(slk){
	baseObj.apikey = slk;
}

/* ========================================================= ***/
/** ========================= ENDPOINTS ===================== **/
/*** ========================================================= */

/* =============================================== **
** DOCS: http://sunlightlabs.github.com/congress/  **
** =============================================== */

//Roll call votes in Congress, back to 2009. Updated within minutes of votes.
module.exports.votes = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "votes";

	return obj;
}

//Committee hearings in Congress. Updated as hearings are announced.
module.exports.hearings = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "hearings";

	return obj;
}

//To-the-minute updates from the floor of the House and Senate.
module.exports.floorUpdates = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "floor_updates";

	return obj;
}

//Legislation in the House and Senate, back to 2009. Updated daily.
module.exports.bills  = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "bills";

	return obj;
}

//Full text search over legislation.
module.exports.billsSearch  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "bills/search";

    return obj;
}

//Current legislators' names, IDs, biography, and social media.
module.exports.legislators  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "legislators";

    return obj;
}

//Find representatives and senators for a latitude/longitude or zip.
module.exports.legislatorsLocate  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "legislators/locate";

    return obj;
}

//Find congressional districts for a latitude/longitude or zip
module.exports.districtsLocate  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "districts/locate";

    return obj;
}

//Current committees, subcommittees, and their membership.
module.exports.committees  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "committees";

    return obj;
}

//Bills scheduled for debate in the future, as announced by party leadership.
module.exports.upcomingBills  = function(slk){

    var obj = extend(true, {}, baseObj);
    obj.setKey(slk);
    obj.collection = "upcoming_bills";

    return obj;
}


/* ========================================================= ***/
/** =================== JQUERY EXTEND PORT ================== **/
/*** ========================================================= */

/* =============================================================================================== **
** Suggested By: http://stackoverflow.com/questions/9399365/deep-extend-like-jquerys-for-nodejs    **
** From: https://github.com/jquery/jquery/blob/master/src/core.js                                  **
** =============================================================================================== */

function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false,
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,
    class2type = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regexp",
        "[object Object]": "object"
    },
    jQuery = {
        isFunction: function (obj) {
            return jQuery.type(obj) === "function"
        },
        isArray: Array.isArray ||
        function (obj) {
            return jQuery.type(obj) === "array"
        },
        isWindow: function (obj) {
            return obj != null && obj == obj.window
        },
        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
        },
        type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
        },
        isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
              	return false
            }
            try {
              	if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                	return false
              	}
            } 
            catch (e) {
      	        return false
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key)
        }
    };
    if (typeof target === "boolean") {
    	deep = target;
    	target = arguments[1] || {};
        i = 2;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
    	target = {}
    }
    if (length === i) {
        target = this;
    	--i;
    }
    for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
          	for (name in options) {
            	src = target[name];
            	copy = options[name];
            	if (target === copy) {
              		continue
            	}
            	if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              		if (copyIsArray) {
                		copyIsArray = false;
                		clone = src && jQuery.isArray(src) ? src : []
              		} else {
                		clone = src && jQuery.isPlainObject(src) ? src : {};
              		}
              		// WARNING: RECURSION
              		target[name] = extend(deep, clone, copy);
            	} 
            	else if (copy !== undefined) {
              		target[name] = copy;
            	}
        	}
        }
    }
    return target;
}