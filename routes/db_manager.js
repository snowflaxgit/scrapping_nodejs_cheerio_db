//var request = require("request");
var cheerio = require("cheerio");

var request = require('request')
, url = require('url');
	

// import database
var mongo = require('mongodb');
 
//create database server
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
//var io = require('socket.io').listen(server, { log: false });

// create cartdb Database
db = new Db('Newshunt', server);
var db_name = ['language', 'newspaper', 'scrape'];

// set intervaal
var hours = 2,
	mnt=1;

exports.lanFlags = [];
exports.newsFlags = [];
exports.scrapeFlags = [];

// open database 
db.open(function(err, db) {
    if(!err) {
		var i=0;
		function myLoop(){
			setTimeout(function () {
				if(i<db_name.length){
					var dbName = db_name[i];
					db.collection(dbName, {safe:true}, function(err, collection) {        	
					   if (err) {
							console.log("The '"+dbName+"' collection doesn't exist. Creating it with sample data..."+err);
							populateDB(dbName);
						}
						else{
							//populateDB(dbName);
							//console.log("The '"+dbName+"' is exist.. "+collection);					
							collection.find().toArray(function(err, items) {
								 if(items.length == 0){
									populateDB(dbName);
									console.log("Length-1:::"+items.length);
									//console.log(items);
								 }else{
									console.log("Length-2:::"+items.length);
								 }
								 exports.lanFlags.push(dbName);							
							});				
						}
					});
					
					myLoop();
				}	
				i++;
			},1000);
		}
		myLoop();		
    }
});
//var keyword = ['TheHindu','IBNLive','DeccanHerald','BBCHindi','AajTak','Sandesh','GujaratSamachar','DeshGujarat'];
var id='';
var getLanguageID = function(keyword, callback){
	var languageName;
	//english
	if(keyword == 'TheHindu' || keyword == 'IBNLive' || keyword == 'DeccanHerald' ){
		languageName = 'English';
	}
	
	//hindi
	else if(keyword == 'BBCHindi' || keyword == 'AajTak' ){
		languageName = 'Hindi';
	}
	
	//gujarati
	else if(keyword == 'Sandesh' || keyword == 'GujaratSamachar' || keyword == 'DeshGujarat' ){
		languageName = 'Gujarati';
	}
	else{
	}
	
	if(languageName){
		db.collection('language', {safe:true}, function(err, collection) {
			collection.findOne({language_name: languageName},function(err, doc) {				
				callback(doc._id);
			});	
		});
	}
};

exports.getNewsPaperID = function(keyword, callback){		
	if(keyword){
		db.collection('newspaper', {safe:true}, function(err, collection) {
			collection.findOne({newspaper_name: keyword},function(err, doc) {
				//console.log(doc);
				if(doc == null){
					//console.log(err);
				}
				else{				
					callback(doc._id);
				}
			});	
		});
	}
};

var get_NewsPaperID_LanguageID = function(keyword, callback){		
	if(keyword){
		db.collection('newspaper', {safe:true}, function(err, collection) {
			collection.findOne({newspaper_name: keyword},function(err, doc) {				
				callback(doc._id, doc.languageID);
			});	
		});
	}
};


exports.saveNewsPaper = function(keyword, myArr){
	
	var NewsPaper = new Array(), 
	languageID;
	
	db.collection('newspaper', {safe:true}, function(err, collection) {
		collection.findOne({newspaper_name: keyword},function(err, doc) {
			//console.log("newspaper : "+doc);
		
			if(err){
				console.log(err);
			}
			if(doc == null ){
			
				getLanguageID(keyword, function(id){
					languageID = id;
				
					NewsPaper.push({		
						languageID : languageID, // get LanguageID
						newspaper_name : myArr[0].newspaper_name, 
						newspaper_logo : myArr[0].newspaper_logo,			
						newspaper_status : 'Active'
					});
										
					collection.insert(NewsPaper, {safe:true}, function(err, result) {
						if(!err){
							//console.log(result);
						}	
					});				
				});			
				
			}
			else{
				//console.log('NewsPaper is matched..');	
			}
			
		
		});
	});	
}

exports.saveScrape = function(keyword, myArr){
	
	//console.log(myArr);
	
	db.collection('scrape', {safe:true}, function(err, collection) {
			collection.findOne({scrape_title: myArr[0].scrape_title},function(err, doc) {				
				//console.log("all : "+doc);
				
				if(doc == null){	
					var Scrape = new Array();
					
					var objToday = new Date(),
						 curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
						 curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
						 curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
						 curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
						 
					var scrape_systemTime = objToday.toDateString() +" "+ curHour+":"+curMinute+":"+curSeconds+" "+curMeridiem;
					
					//console.log(scrape_systemTime);
										
					get_NewsPaperID_LanguageID(keyword, function(newspaperID, languageID){
					
						Scrape.push({	
							newspaperID : newspaperID,	
							languageID : languageID,
							scrape_tabs_title  : myArr[0].scrape_tabs_title,	
							scrape_tabs_href: myArr[0].scrape_tabs_href,	
							scrape_thumb : myArr[0].scrape_thumb,
							scrape_href : myArr[0].scrape_href,	
							scrape_title : myArr[0].scrape_title,
							scrape_largeimage : myArr[0].scrape_largeimage,
							scrape_detail_article_text : myArr[0].scrape_detail_article_text,
							scrape_systemTime : scrape_systemTime,
							scrape_newstime : myArr[0].scrape_newstime,
							scrape_status : "Pending"
						});
						//console.log(Scrape);	
						
						collection.insert(Scrape, {safe:true}, function(err, result) {
							if(!err){
								console.log(result);
							}	
						});	
					});
				}
				else{
					//console.log("scrape title is matched....")
				}
		});			
	
	});
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function(dbName) {
	
	var language = [
		{
			language_name : "English",
			language_status : "Active"
		},
		{
			language_name : "Hindi",
			language_status : "Active"
		},
		{
			language_name : "Gujarati",
			language_status : "Active"
		}
	];
    var newspaper = [];
    var	scrape = [];
	var	myArr='' ;
	//for(var i=0;i<db_name.length;i++){
	db.collection(dbName, function(err, collection) {		
		
		//collection.remove(); //remove database    
		if(dbName == 'language'){
			//collection.remove();			
			collection.insert(language, {safe:true}, function(err, result) {
				if(!err){
					//console.log(result);
				}	
				//exports.lanFlags.push(dbName);
			});
		}
		if(dbName == 'newspaper'){			
			collection.insert(newspaper, {safe:true}, function(err, result) {
				if(!err){
					//console.log(result);
				}	
				//exports.lanFlags.push(dbName);
			});
		}
		if(dbName == 'scrape'){			
			collection.insert(scrape, {safe:true}, function(err, result) {
				if(!err){
					//console.log(result);
				}	
				//exports.lanFlags.push(dbName);
			});
		}
		
	});
//	}	
 
}; 