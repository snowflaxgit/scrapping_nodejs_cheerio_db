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
var db_name = ['sandesh', 'gujaratsamachar'];

// set intervaal
var hours = 2,
	mnt=1;

// open database 
db.open(function(err, db) {
    if(!err) {
		
		for(var i=0;i<db_name.length;i++){
			db.collection(db_name[i], {safe:true}, function(err, collection) {        	
			   if (err) {
					console.log("The '"+db_name[i]+"' collection doesn't exist. Creating it with sample data..."+err);
					populateDB();
				}
				else{
					//populateDB();
					//console.log("The '"+db_name[i]+"' is exist.. "+collection);					
					collection.find().toArray(function(err, items) {
						 if(items.length == 0){
							populateDB();
							//console.log("Length-1:::"+items.length);
							//console.log(items);
						 }else{
							console.log("Length-2:::"+items.length);
						 }
					});				
				}
			});
		}
    }
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'NewsHunt' });
};

// database 

var saveTabs = function(keyword,arr){
	//console.log(arr);
	db.collection(keyword, function(err, collection) {		
		collection.remove(); //remove database        
		collection.insert(arr, {safe:true}, function(err, result) {
			if(err){
				console.log(err);
			}
			else{
				//console.log(result);
				collection.remove(); 
				getTabsData(result);
			}	
		});
    });
}

var saveTabsData = function(keyword,arr){
	//console.log(arr);
	db.collection(keyword, function(err, collection) {		
		//collection.remove(); //remove database        
		collection.insert(arr, {safe:true}, function(err, result) {
			if(err){
				console.log(err);
			}
			else{
				//console.log(result);
				getHeadlinesDetails(result);
			}	
		});
    });
}

var saveHeadlinesDetails = function(arr){
	//console.log(arr[0]);
	
	var keyword = arr[0].keyword,
		headlines_href = arr[0].headlines_href,
		headlines_title = arr[0].headlines_title;
		 
	db.collection(keyword, function(err, collection) {
        collection.update({'headlines_href': headlines_href}, arr[0], {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log(keyword + " == >" + headlines_title + result + ' document(s) updated');
				console.log("=========================== XX  =====================");
                //res.send(contact);
				//res.render('update', {contacts : [contact]} );
            }
        });
    });
	
}

var removeTableData = function(keyword){
	//console.log(arr);
	db.collection(keyword, function(err, collection) {		
		collection.remove(); //remove database        		
    });
}

var getData = function(){
	
	var i = 0;
//	for(var i=0;i<db_name.length;i++){
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < db_name.length) {
			
				<!-- sandesh -->
				if(db_name[i] == 'sandesh' ){
					
					var URI = "http://www.sandesh.com/", // define URI first
						keyword = db_name[i]; 
					
					request({
					  uri: URI,
					}, function(error, response, body) {
		       			
		       			var self = this;
						self.tabs = new Array();//I feel like I want to save my results in an array
						
		     			//Just a basic error check
		                if(error && response.statusCode !== 200){
							console.log('Request error.');
						}

					    var $ = cheerio.load(body),
					  	  	$topNav = $('.topNav'),
						  	$li = $('ul.topnav > li');
									
						$li.each(function (i, item) {
							var $tab = $(item).children('a').text(),
								$href = URI + $(item).children('a').attr("href");
									
							if($tab == "National" || $tab == "Business" || $tab == "Life" || $tab == "World"  || $tab == "Sports"){	
								//and add all that data to my items array
								self.tabs.push({
									keyword : 'sandesh',
									uri : URI,
									tabs_title : $tab,
									tabs_href: $href						
								});
							}
							//setTimeout(getTabsData(self.tabs),3000);
							//console.log("sandesh");
						});
						//console.log(self.tabs);
						saveTabs(keyword, self.tabs);
						//getTabsData(self.tabs)
						//setTimeout(getTabsData(self.tabs),3000);
					});
				} 
				<!-- sandesh - end -->

				<!-- gujaratsamachar -->
				if(db_name[i] == 'gujaratsamachar' ){
					
					var URI = "http://www.gujaratsamachar.com/", // define URI first
						keyword = db_name[i]; 

					request({
					  uri: URI,
					}, function(error, response, body) {
		       			
		       			var self = this;
						self.tabs = new Array();//I feel like I want to save my results in an array

		     			//Just a basic error check
		                if(error && response.statusCode !== 200){
							console.log('Request error.');
						}

					    var $ = cheerio.load(body),
					  	  	$ul=$('ul.menu'),
							$li=$('ul.menu > li');
								 
						$li.each(function (i, item) {
							var $tab = $(item).children('a').text(),
								$href = $(item).children('a').attr("href");
								
							if($tab == "National" || $tab == "Business" || $tab == "International" || $tab == "Entertainment"  || $tab == "Sports"){	
								//and add all that data to my items array
								self.tabs.push({
									keyword : 'gujaratsamachar',
									uri : URI,
									tabs_title : $tab,	
									tabs_href: $href					
								});
							}
							//setTimeout(getTabsData(self.tabs),3000);
							//console.log("gujaratsamachar");
						 });		
						//console.log(self.tabs);
						//getTabsData(self.tabs)
						saveTabs(keyword, self.tabs);
					});
				} 
				<!-- gujaratsamachar - end -->
				myLoop();
			}	
			i++;
		},80000);	
	}
	myLoop();
}

var getTabsData = function(arr){
	var myArr = new Array();	
	var i = 0;
//	for(var i=0;i<arr.length;i++){
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

		if (i < arr.length) {
			//console.log(arr[i].keyword);
			
			var keyword = arr[i].keyword,
				tabs_href = arr[i].tabs_href,
				tabs_title = arr[i].tabs_title;
				

			if(keyword == 'sandesh'){
				//console.log(keyword,tabs_title,tabs_href);					
				request({
				  uri: tabs_href,
				}, function(error, response, body) {
					
					//console.log(keyword,tabs_title,tabs_href);	
					
					var self = this;
					self.tabData = new Array();//I feel like I want to save my results in an array
					
				  	//Just a basic error check
	                if(error && response.statusCode !== 200){
						console.log('Request error.');
					}

					var $ = cheerio.load(body),			  
				  		tab_url = "http://www.sandesh.com/",

						//Use jQuery just as in a regular HTML page
						$hpTop = $('.pg_news'),
						$li = $hpTop.find('ul > li');
							
					$li.each(function (i, item) {
						//I will use regular jQuery selectors
						var $img = tab_url+$(item).children('img').attr("src"),
							$title = $(item).children('h1').children('a').text().trim(),
							$href = tab_url+$(item).children('h1').children('a').attr("href");
							//$content = $(item).children('h2').text().trim();						
											
						//and add all that data to my items array
						self.tabData.push({
							keyword : keyword,
							tabs_title : tabs_title,
							tabs_href : tabs_href, 
							headlines_title : $title,
							headlines_href : $href,
							headlines_img : $img								
						});
					});
					//console.log(self.tabData); // console log
					//getHeadlinesDetails(self.tabData);
					saveTabsData(keyword, self.tabData);
					myArr.push(self.tabData);
				});
			}

			if(keyword == 'gujaratsamachar'){
				//console.log(keyword,tabs_title,tabs_href);	
				request({
				  uri: tabs_href,
				}, function(error, response, body) {

					//console.log(keyword,tabs_title,tabs_href);	
					
					var self = this;
					self.tabData = new Array();//I feel like I want to save my results in an array
					
				  	//Just a basic error check
	                if(error && response.statusCode !== 200){
						console.log('Request error.');
					}

					var $ = cheerio.load(body),			  
				  		$hpTop = $('.main-box56'),
						$div = $hpTop.find('div.mr-main-box');
							
					$div.each(function (i, item) {
						 
						//I will use regular jQuery selectors
						var $img = $(item).children('div.imgbox').children('a').children('img').attr("src").trim(),
							$title = $(item).children('div.viru404-hit420').children('a.mr-href-title').text().trim(),
							$href = $(item).children('div.viru404-hit420').children('a.mr-href-title').attr('href');
							//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
											
						//and add all that data to my items array
						self.tabData.push({
							keyword : keyword,
							tabs_title : tabs_title,
							tabs_href : tabs_href, 
							headlines_title : $title,
							headlines_href : $href,
							headlines_img : $img								
						});
					});
					//console.log(self.tabData); // console log
					//getHeadlinesDetails(self.tabData);
					saveTabsData(keyword, self.tabData);
					myArr.push(self.tabData);
				});
			}
			myLoop();
			}
			/*else{
				getHeadlinesDetails(myArr);
				console.log("myArr : "+myArr);
				for(var i=0;i<myArr.length;i++){
					console.log(myArr[i].keyword, myArr[i].tabs_title);	
				}	
			}*/
			i++;

		},11000);
	}
	myLoop();
}	


var getHeadlinesDetails = function(arr){
	//console.log(arr);
	var i = 0;
	var headlinesData = new Array();//I feel like I want to save my results in an array
//	for(var i=0;i<arr.length;i++){
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < arr.length) {

				var keyword = arr[i].keyword,
					tabs_title = arr[i].tabs_title,
					tabs_href = arr[i].tabs_href,
					headlines_title = arr[i].headlines_title,
					headlines_href = arr[i].headlines_href,
					headlines_img = arr[i].headlines_img;

				if(keyword == 'sandesh'){
					
					request({
					  uri: headlines_href,
					}, function(error, response, body) {
						
						var self = this;
						self.headlinesData = new Array();//I feel like I want to save my results in an array
						
					  	//Just a basic error check
		                if(error && response.statusCode !== 200){
							console.log('Request error.');
						}

						var $ = cheerio.load(body),			  
					  		tab_url = "http://www.sandesh.com/",

							//Use jQuery just as in a regular HTML page
							$articleClass = $('.ArticleTitle');
								
						 $articleClass.each(function (i, item) {
						 
							//I will use regular jQuery selectors
							var $articleCont = $('span#lblNews').text().trim();						
												
							//console.log($img,$a,$div);
							//and add all that data to my items array
							self.headlinesData.push({
								keyword : keyword,
								tabs_title : tabs_title,
								tabs_href : tabs_href, 
								headlines_title : headlines_title,
								headlines_href : headlines_href,
								headlines_img : headlines_img,
								headlines_content : $articleCont								
							});
						});
						//console.log(self.headlinesData); // console 
						saveHeadlinesDetails(self.headlinesData);
					});
				}

				if(keyword == 'gujaratsamachar'){
					
					request({
					  uri: headlines_href,
					}, function(error, response, body) {
						
						var self = this;
						self.headlinesData = new Array();//I feel like I want to save my results in an array
						
					  	//Just a basic error check
		                if(error && response.statusCode !== 200){
							console.log('Request error.');
						}

						var $ = cheerio.load(body),			  
					  		$articleClass = $('.main-box57');
						
							$articleClass.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $articleCont = $(item).children('span.fittext3').text().trim();					
													
								//and add all that data to my items array
								self.headlinesData.push({
									keyword : keyword,
									tabs_title : tabs_title,
									tabs_href : tabs_href, 
									headlines_title : headlines_title,
									headlines_href : headlines_href,
									headlines_img : headlines_img,
									headlines_content : $articleCont								
								});
							});
						//console.log(self.headlinesData); // console log
						saveHeadlinesDetails(self.headlinesData);
					});
				}
				myLoop();
			}					
			i++;

		},1000);		
	}	
	myLoop();
};
			
//getData();		
setInterval(getData,(hours*60*60*1000));
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var sandesh = [];
    var gujaratsamachar = [];
    var indiatimes = [];
 	
	for(var i=0;i<db_name.length;i++){
		db.collection(db_name[i], function(err, collection) {		
			collection.remove(); //remove database        
			collection.insert(db_name[i], {safe:true}, function(err, result) {
				if(err){
					console.log(err);
				}
				else{
					//console.log(result);
				}	
			});
		});
	}	
 
}; 