/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var http = require("http");




/* ========================================================= ***/
/** ================= ENDPOINT WIDE FUNCTIONS =============== **/
/*** ========================================================= */

var setKey = function(key){
	if(typeof key != "undefined"){
		this.apikey = key;
	}
}

var filter = function(field, value, operator){
	if(typeof operator == "undefined"){
		this.query =  this.query+"&"+field+"="+value;
	}
	else{
		this.query =  this.query+"&"+field+"__"+operator+"="+value;
	}
	
	return this;
}

//CALL OUT TO THE API
var call = function(success, failure){
	keyCheck(this.apikey);
	var endpoint = basepoint+this.collection+"?apikey="+this.apikey+this.query;

	if(typeof failure == "undefined"){
		failure = failedCall;
	}
	console.log(endpoint);
	http.get(endpoint, function(res){
		var data = "";
		res.on("data", function(chunk){
			data+=chunk;
		});
		res.on("end", function(){
			success(data);
		})
	}).on("error", failure);
}


//CONFIRM THAT THE APIKEY HAS BEEN SET
var keyCheck = function(key){
	if(key==undefined){
		throw new Error("YOU MUST USE INIT TO DEFINE YOUR SUNLIGHT FONDATION API KEY!");
	}
}

//IF A FAILURE CALLBACK IS NOT SUPPLIED, THIS WILL BE CALLED
var failedCall = function(error){
	console.log("ERROR: "+error.message);
}

/* ========================================================= ***/
/** ==================== BASIC OBJECT DATA ================== **/
/*** ========================================================= */

var basepoint = "http://congress.api.sunlightfoundation.com/";
var baseObj = {
	apikey : undefined,
	collection: "",
	query: "",
	call: call,
	setKey: setKey,
	filter: filter
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

/* ========================================================================== **
** DOCS: http://services.sunlightlabs.com/docs/Real_Time_Congress_API/votes/  **
** ========================================================================== */

module.exports.votes = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "votes";

	return obj;
}

module.exports.documents = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "documents";

	return obj;
}

module.exports.committeeHearings = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "committee_hearings";

	return obj;
}

module.exports.floorUpdates = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "floor_updates";

	return obj;
}

module.exports.videos  = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "videos";

	return obj;
}

module.exports.amendments  = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "amendments";

	return obj;
}

module.exports.bills  = function(slk){

	var obj = extend(true, {}, baseObj);
	obj.setKey(slk);
	obj.collection = "bills";

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