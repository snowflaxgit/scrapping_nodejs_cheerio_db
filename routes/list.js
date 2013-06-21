var request = require('request')
, url = require('url');

// import database
var mongo = require('mongodb');

exports.list = function(req, res){
	var keyword = req.params.id;
	//console.log(id);	
	db.collection(keyword, function(err, collection) {
        collection.find().toArray(function(err, items) {
			//console.log(items);
			res.render('list', {title: 'NewsHunt - '+keyword, items : items} );
            //res.send(items);
        });
    });	
};