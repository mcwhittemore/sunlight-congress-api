/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var https = require("https");
var Promise = require("es6-promise").Promise;

/* ========================================================= ***/
/** ===================== PUBLIC FUNCTIONS ================== **/
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
        throw Error("MUST SUPPLY AT LEAST ONE ARGUMENT");
    }

    if(typeof field === "string"){

        if(typeof dir == "undefined"){
            dir = "desc";
        }

        dir = dir.toLowerCase();

        if(dir!="desc"&&dir!="asc"){
            throw Error("ORDER DIRECTION MUST BE desc or asc");
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
                throw Error("INVALID ORDER ARGUMENT");
            }

            this.filter("order", field+"__"+direction);

        }
        return this;
    }
}

//PICK WHICH FILEDS TO DISPLAY
var fields = function(){
    if(arguments.length<0){
        throw Error("MUST SUPPLY AT LEAST ONE FIELD");
    }

    for(var i=0; i<arguments.length; i++){
        this.filter("fields", arguments[i]);
    }

    return this;
}

//SEARCH FOR FULL PHRASE IN RESULTS
var search = function(q){

    if(this.collection.replace("/search", "") != this.collection){
        q = validateSearch(q);
    }

    return this.filter("query", q);
}

//Global add parms function, also used directly to currate the where clause
var filter = function(field, value, operator){

    //if date, convert to iso format string
    if(Object.prototype.toString.call(value) === '[object Date]'){
        value = value.toISOString();
    }

    if(typeof operator != "undefined" && operator != "="){
        if(field!="order"){
            operatorCheck(operator);
            field = field+"__"+operator;
        }
        else if(operator=="asc"||operator=="desc"){
            value = value+"__"+operator;
        }
        else{
            throw Error("("+operator+") is not a valid operator for "+field);
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

// Add latitude and longitude
var addCoordinates = function(coordinates) {
  if(coordinates.latitude != undefined && coordinates.longitude != undefined) {
    return this.filter("latitude", coordinates.latitude)
      .filter("longitude", coordinates.longitude);
  } else {
    throw Error("MUST SUPPLY VALID LATITUDE AND LONGITUDE");
  }
}
// Add zipcode
var addZipCode = function(zip) {
  if(zip != undefined) {
    return this.filter("zip", zip);
  } else {
    throw Error("MUST SUPPLY VALID Zip Code");
  }
}

var explain = function(){
    console.log("This is a convenience for debugging, not a \"supported\" API feature. Don't make automatic requests with explain mode turned on.");
    return this.filter("explain", true);
}

//INCREMENT THE PAGE AND CALL OUT TO THE API
var next = function(success, failure){

    if(typeof this.queryObj.page != "number"){
        this.queryObj.page = 0;
    }

    this.queryObj.page++;

    return this.call(success, failure);
}

//CALL OUT TO THE API
var call = function(callback, fail){

    var deferred;

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
    //AH! no callback. Use a promise instead.
    else{
        deferred = defer();
        callback = deferred.resolve.bind( deferred );
    }

    //passed a new failure function
	if(typeof fail != "undefined"){
		this.failure = fail;
	}
    //didn't pass a new failure function
    else if(typeof this.failure != "undefined"){
        fail = this.failure;
    }
    //AH! no failure function. Use a promise instead.
    else{
        if(!deferred) {
          deferred = defer();
        }
        fail = deferred.reject.bind( deferred );
    }

    var endpoint = this.getEndpoint();
	https.get(endpoint, function(res){
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
        data = {
            status: "error",
            error: e,
            results: []
        }
        fail(data);
    });

  if(deferred) {
    return deferred.promise;
  }
}

var querystring = require("querystring");
var getEndpoint = function(){
    this.query = "";
    var keys = Object.keys(this.queryObj);

    if(this.apikey){
        this.queryObj.apikey = this.apikey;
    }

    this.query = querystring.stringify(this.queryObj);


    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        var value = encodeURIComponent(this.queryObj[key]);
        this.query += "&"+key+"="+value;
    }


    if(this.collection){
        return this.apiUrl+this.collection+"/?"+this.query;
    }
    else{
        //we're requesting the status page this way
        return this.apiUrl;
    }

}

/* ========================================================= ***/
/** ==================== BASIC OBJECT DATA ================== **/
/*** ========================================================= */

module.exports = {

    //BASE DATA
    apiUrl: "https://congress.api.sunlightfoundation.com/",
	apikey : undefined,
	collection: "",
	query: "",
    queryObj: {}, //used to stage

    //CORE FUNCTIONS
	call: call,
    explain: explain,
	filter: filter,
    page: page,
    next: next,
    order: order,
    fields: fields,
    search: search,
    getEndpoint: getEndpoint,

//  add zip code or lat/long to call
  addCoordinates: addCoordinates,
  addZipCode: addZipCode,

    //CALLBACK FUNCTIONS
    success: undefined,
    failure: function(data){
        console.log("ERROR: "+data.error.message);
    }
}

/* ========================================================= ***/
/** ==================== BACKEND FUNCTIONS ================== **/
/*** ========================================================= */

//CONFIRM THAT THE OPERATOR IS VALID
var operatorCheck = function(operator){
    // PER: https://sunlightlabs.github.io/congress/#operators
    // gt - the field is greater than this value
    // gte - the field is greater than or equal to this value
    // lt - the field is less than this value
    // lte - the field is less than or equal to this value
    // not - the field is not this value
    // all - the field is an array that contains all of these values (separated by |)
    // in - the field is a string that is one of these values (separated by |)
    // nin - the field is a string that is not one of these values (separated by |)
    // exists - the field is both present and non-null (supply true or false)

    var valids = ["gt", "gte", "lt", "lte", "not", "all", "in", "nin", "exists"];

    if(valids.indexOf(operator)==-1){
        throw new Error("In valid operator. Please see https://sunlightlabs.github.io/congress/#operators for a full list");
    }
}

//VALIDATE SEARCH. USED ON ENDPOINTS ENDING IN /search ONLY
var validateSearch = function(q){
    q = q.replace(/" *~/g, '"~'); //REMOVE SPACES BETWEEN " AND ~
    q = q.replace(/~ */g, "~"); // REMOVE SPACES DIRECTLY AFTER ~

    var q_parts = q.split('"');

    if(q_parts[0]==""){
        q_parts = q_parts.slice(1);
    }

    var inPhrase = false;

    for(var i=0; i<q_parts.length; i++){
        inPhrase = !inPhrase;

        var part = q_parts[i];

        if(part.indexOf("*") !== -1 && inPhrase){
            var err = "YOU MAY NOT USE * INSIDE OF A PHRASE ("+part+")";
            throw Error(err);
        }
        else if(part.substring(0,1)=="~" && part.replace(/^~[0-9]+/, "") == part){
            var err = "A NUMBER MUST FOLLOW A ~ AFTER A PHRASE ("+part+")";
            throw Error(err);
        }
    }

    return q;
}

// CREATE A DEFERRED OBJECT.
var defer = function() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
