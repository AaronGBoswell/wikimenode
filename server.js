var parsedJson = require('./favs.json');
var fs = require('fs');
var STATIC_PREFIX = 'static';

var server = require('http').createServer(function(req,res){

	res.writeHead(200);
	//get parameters of url and reduce them to an array
	var params = req.url.split("/");
	//remove first '' from array
	var index = params.indexOf('');

	params.splice(index,1);

	//if the second one is '' remove it aslso
	var index = params.indexOf('');
	if (index == 0)
		params.splice(index,1);
		//if there are no parameters, serve the index
	if(params.length == 0){
		fs.readFile('./index.html', function (err, html) {
		    if(err) {        
        		res.writeHead(500, {"Content-Type": "text/plain"});
        		res.write(err + "\n");
        		res.end();
        		return;
     		}
			res.write(html);  
        	res.end();  
		});

	}
	//if the first parameter is static, serve the file
	else if (params[0] == STATIC_PREFIX){
    	fs.readFile(params[1], "binary", function(err, file) {
      		if(err) {        
        		res.writeHead(500, {"Content-Type": "text/plain"});
        		res.write(err + "\n");
        		res.end();
        		return;
     		}
      		res.writeHead(200);
      		res.write(file, "binary");
      		res.end();
    	});
    }
    //if the first parameter give us good data
    else if(params[0] == 'data'){
    	//second parameter is users?
    	if(params[1] == 'users'){
    		//if nothing else give us all data
    		if(params.length == 2){
    			if (allUsers() != null)
    				res.end(JSON.stringify(allUsers()));
    			else{
    				res.writeHead(404);
  					res.write("404 Not Found\n");
  					res.end();
    			}
    		} 
    		//if there is an username give us just that data
    		else if(params.length == 3){
    			if (userDetails(params[2]) != null)
    				res.end(JSON.stringify(userDetails(params[2])));
    			else{
    				res.writeHead(404);
  					res.write("404 Not Found\n");
  					res.end();
    			}
    		} 
    		//otherwise error
    		else{
    			res.writeHead(404);
  				res.write("404 Not Found\n");
  				res.end();
    		}
    	}
    	//if second parameter is tweets
    	else if(params[1] == 'tweets'){
    		//if nothing else, give us all tweets
    		if(params.length == 2){
    			if (allTweets() != null)
    				res.end(JSON.stringify(allTweets()));
    			else{
    				res.writeHead(404);
  					res.write("404 Not Found\n");
  					res.end();
    			}
    		}
    		//if there is an ID give us that information
    		else if(params.length == 3){
    			if (tweetDetails(params[2]) != null)
    				res.end(JSON.stringify(tweetDetails(params[2])));
    			else{
    				res.writeHead(404);
  					res.write("404 Not Found\n");
  					res.end();
    			}
    		}
    		//otherwise error
    		else{
    			res.writeHead(404);
  				res.write("404 Not Found\n");
  				res.end();
    		}
    	}
    	//if the second parameter is URLS
    	else if(params[1] == 'URLS'){
    		//if there is nothing else, give us all the url info
    		if(params.length == 2){
    			if (allURLS() != null)
    				res.end(JSON.stringify(allURLS()));
    			else{
    				res.writeHead(404);
  					res.write("404 Not Found\n");
  					res.end();
    			}
    		}
    		//otherwise error
    		else{
    			res.writeHead(404);
  				res.write("404 Not Found\n");
  				res.end();
    		}
    	} else{
    		res.writeHead(404);
  			res.write("404 Not Found\n");
  			res.end();
    	}
    	
    } else{
    		res.writeHead(404);
  			res.write("404 Not Found\n");
  			res.end();
    }

});
server.listen(3000);

var parsedJson = require('./favs.json');
//returns all of the external links
//grouped by tweet id
function allURLS(){
	var result = [];
	for(var i = 0; i < parsedJson.length; i++) {
		var array = [];
		var obj = parsedJson[i];
		var id = obj.id;
		if(!exists(id,result)){
			var regex = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'gi');
 			var array = obj.text.match(regex);
 			result.push({id:id,urls: array});
    	}
	}
	return result;
}
//returns all of the external links
//within a tweet given by id
function tweetURLS(id){
	var result = [];
	for(var i = 0; i < parsedJson.length; i++) {
		if(!exists(id,result)){
			var array = [];
	    	var obj = parsedJson[i];
    		var ide = obj.id;
    		if(id == ide){	
				var regex = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'gi');
 				var array = obj.text.match(regex);
 				result.push({id:id,urls: array});
    		}
    	}
	}
	return result;
}
//returns some information on all of the users
function allUsers(){
	var result = [];
	for(var i = 0; i < parsedJson.length; i++) {
    	var obj = parsedJson[i];
    	var name = obj.user.name;
    	var id = obj.user.id;
    	var screen_name = obj.user.screen_name;
    	if (!exists(id,result)){
    		result.push({id:id,name: name,screen_name:screen_name});
    	}
	}
	return result;
}
// returns some information about all tweets
function allTweets(){
	var result = [];
	for(var i = 0; i < parsedJson.length; i++) {
    	var obj = parsedJson[i];
    	var created_at = obj.created_at;
    	var id = obj.id;
    	var text = obj.text;
		if(!exists(id,result)){
    		result.push({created_at: created_at, id:id,text:text});
    	}
	}
	return result;
}
//returns all information on tweet given an id
function tweetDetails(id){
	for(var i = 0; i < parsedJson.length; i++) {
    	var obj = parsedJson[i];
    	if( obj.id == id){
    		return obj;
    	}
	}
	return null;
}
//returns all information on a user given screename
function userDetails(screenname){
	for(var i = 0; i < parsedJson.length; i++) {
    	var obj = parsedJson[i];
    	if( obj.user.screen_name == screenname){
    		return obj.user;
    	}
	}
	return null;
}
//return true if an object within array has
// a key named id whose value is the same as id
function exists(id,array){
	for(var i = 0; i < array.length; i++) {
    	var obj = array[i];
    	var ide = obj.id;
		if (ide == id){
			return true;
		}
	}
	return false;
}