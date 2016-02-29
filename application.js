//when document is done loading, bind click function to all of the buttons.
$(document).ready(function(){
    
    $('#getexternals').on('click', function(e){
        $.ajax('/data/URLS', {
            success: displayURLS
        });
    });
    $('#gettweets').on('click', function(e){
        $.ajax('/data/tweets', {
            success: displayTweets
        });
    });
    $('#getusers').on('click', function(e){
        $.ajax('/data/users', {
            success: displayUsers
        });
    });
    
    $('#gettweet').on('click', function(e){
        //get the value of the search field and add it to the url
        $.ajax('/data/tweets/'+(document.getElementById("search").value) , {
            success: displayTweet
        });
    });
    $('#getuser').on('click', function(e){
        //get the value of the search field and add it to the url

        $.ajax('/data/users/'+(document.getElementById("search").value) , {
            success: displayUser
        });
    });
});

//display some information about the tweet
function displayTweet(response){
    var obj = JSON.parse(response);
    if (obj == null){
        return
    }
    var newInfo = $('<div><br></div>');
    newInfo.append("<div><span>" + obj.id + "  </span><span><strong> '" + obj.text + "' </strong></span><span>" + obj.created_at + "</span></div><br>");
    newInfo.append("<div><span>Retweet count: " + obj.retweet_count + "  </span><span> Re-tweeted: " + obj.retweeted + "</span><span> Favorited:" + obj.favorited + "</span></div><br>");

    $('#information').html(newInfo).slideDown();
}

//display some information about the user
function displayUser(response){
    var obj = JSON.parse(response);
    if (obj == null){
        return
    }
    var newInfo = $('<div><br></div>');
    newInfo.append("<div><span><strong> '" + obj.name + "' </strong></span><span>" + obj.screen_name + "</span></div><br>");
    newInfo.append("<div><span>Location: " + obj.location + "  </span><span> Verified: " + obj.verified + "</span><span> Followers:" + obj.followers_count + "</span></div><br>");

    $('#information').html(newInfo).slideDown();
}

//display some information about all tweets
function displayTweets(response){
    var parsedJSON = JSON.parse(response);
    var newInfo = $('<div><br></div>');
    for(var i = 0; i < parsedJSON.length; i++) {
        var obj = parsedJSON[i];
        newInfo.append("<div><span>" + obj.id + "  </span><span><strong> '" + obj.text + "' </strong></span><span>" + obj.created_at + "</span></div><br>");
    }
    $('#information').html(newInfo).slideDown();
}

//display some information about all users
function displayUsers(response){
    var parsedJSON = JSON.parse(response);
    var newInfo = $('<div><br></div>');
    for(var i = 0; i < parsedJSON.length; i++) {
        var obj = parsedJSON[i];
        newInfo.append("<div><span>" + obj.id + "  </span><span><strong> '" + obj.name + "' </strong></span><span>" + obj.screen_name + "</span></div><br>");
    }
    $('#information').html(newInfo).slideDown();
}

//display all the external links
function displayURLS(response){
    var parsedJSON = JSON.parse(response);
    var newInfo = $('<div><br></div>');
    for(var i = 0; i < parsedJSON.length; i++) {
        var obj = parsedJSON[i];
        newInfo.append("<div><span>" + obj.id + "  </span><span><strong> '" + obj.urls[0] + "' </strong></span></div>");
        for(var j = 1; j < obj.urls.length; j++) {
            newInfo.append("<div><span><strong> '" + obj.urls[j] + "' </strong></span></div>");
        }
        newInfo.append("<br>");

    }
    $('#information').html(newInfo).slideDown();
}








