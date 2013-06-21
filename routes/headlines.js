var request = require('request')
, url = require('url');

// import database
var mongo = require('mongodb');

exports.tabs = function(req, res){
	//var uri = req.params.url;
	
	var queryObject = url.parse(req.url,true).query;
  	var keyword = queryObject.keyword;
  	var uri = queryObject.href;
	
	db.collection(keyword, function(err, collection) {
        collection.find({'tabs_href':uri}).toArray(function(err, items) {
			//console.log(items);
			 res.render('headlines', {title: 'NewsHunt - Headlines', items : items} );
            //res.send(items);
        });
    });		
	
};