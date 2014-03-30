/* ========================================================= ***/
/** ================== INCLUDE NEEDED MODULES =============== **/
/*** ========================================================= */
var https = require("https");


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

    this.call(success, failure);
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
        throw Error("YOU MUST DEFINE A SUCCESS FUNCTION BEFORE PERFORMING CALL");
    }

    //passed a new failure function
	if(typeof fail != "undefined"){
		this.failure = fail;
	}
    //didn't pass a new failure function
    else if(typeof this.failure != "undefined"){
        fail = this.failure;
    }
    //AH! no failure function. Lets fail! HA!
    else{
        throw Error("YOU MUST DEFINE A FAILURE FUNCTION BEFORE PERFORMING CALL");
    }

    var endpoint = this.getEndpoint(this.queryObj);


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
}

var getEndpoint = function(){
    this.query = "";
    var keys = Object.keys(this.queryObj);

    for(var i=0; i<keys.length; i++){
        var key = keys[i];
        var value = encodeURIComponent(this.queryObj[key]);
        this.query += "&"+key+"="+value;
    }

    return basepoint+this.collection+"/?apikey="+this.apikey+this.query;
}

var setKey = function(key){
    if(typeof key != "undefined"){
        this.apikey = key;
    }
}

/* ========================================================= ***/
/** ==================== BASIC OBJECT DATA ================== **/
/*** ========================================================= */

var basepoint = "https://congress.api.sunlightfoundation.com/";
module.exports = {

    //BASE DATA
	apikey : undefined,
	collection: "",
	query: "",
    queryObj: {}, //used to stage

    //CORE FUNCTIONS
	call: call,
    explain: explain,
	setKey: setKey,
	filter: filter,
    page: page,
    next: next,
    order: order,
    fields: fields,
    search: search,
    getEndpoint: getEndpoint,

    //CALLBACK FUNCTIONS
    success: undefined,
    failure: function(data){
        console.log("ERROR: "+data.error.message);
    }
}

/* ========================================================= ***/
/** ==================== BACKEND FUNCTIONS ================== **/
/*** ========================================================= */

//CONFIRM THAT THE APIKEY HAS BEEN SET
var keyCheck = function(key){
    if(key==undefined){
        throw Error("YOU MUST USE .init() TO DEFINE YOUR SUNLIGHT FOUNDATION API KEY!");
    }
}

//CONFIRM THAT THE OPERATOR IS VALID
var operatorCheck = function(operator){
    if(false){
        throw Error("NEED ERROR MESSAGE");
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