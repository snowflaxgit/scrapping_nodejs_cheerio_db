var request = require('request')
, url = require('url')
, cheerio = require("cheerio");


// import database
var mongo = require('mongodb');

exports.list = function(req, res){
	var keyword = req.params.id;
	//console.log(id);
	db.collection('newspaper', function(err, collection) {
		 //collection.find({newspaper_name : keyword},{_id:1}).toArray(function(err, items) {
		 collection.findOne({newspaper_name : keyword},function(err, doc) {	 
		 	//console.log(doc._id);
			db.collection('scrape', function(err, collection) {
				collection.find({newspaperID : doc._id}).toArray(function(err, items) {
					//console.log(items);
					res.render('list', {title: 'NewsHunt - '+keyword, items : items} );
					//res.send(items);
				});
			});
			
		 });
	});
	
	<!-- sandesh -->
	/*if(keyword == 'sandesh' ){
		
		var URI = "http://www.sandesh.com/", // define URI first
			keyword = keyword; 
		
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
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
		});
	} 
	<!-- sandesh - end -->

	<!-- gujaratsamachar -->
	if(keyword == 'gujaratsamachar' ){
		
		var URI = "http://www.gujaratsamachar.com/", // define URI first
			keyword = keyword; 

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
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
			//console.log(self.tabs);
			//getTabsData(self.tabs)
		});
	} 
	<!-- gujaratsamachar - end -->
	
	<!-- deshgujarat -->
	if(keyword == 'deshgujarat' ){
		
		var URI = "http://g.deshgujarat.com/", // define URI first
			keyword = keyword; 

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
				$ul=$('#container .menus'),
				$li=$('#container .menus .cat-item');
					 
			$li.each(function (i, item) {
				var $tab = $(item).children('a').text(),
					$href = $(item).children('a').attr("href");
					
				if($tab == "ગુજરાત" || $tab == "બિઝનસ" || $tab == "રાજકાજ" || $tab == "પ્રવાસન"  || $tab == "બોલીવૂડ"){	
					//and add all that data to my items array
					self.tabs.push({
						keyword : 'deshgujarat',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					});
				}
				//setTimeout(getTabsData(self.tabs),3000);
				//console.log("deshgujarat");
			 });
			 //res.send(self.tabs);		
			res.render('list', {title: 'NewsHunt - '+ keyword, items : self.tabs} );
			//console.log(self.tabs);
			//getTabsData(self.tabs)
		});
	} 
	<!-- deshgujarat - end -->
	
	// hindi news
	
	<!-- AajTak -->
	if(keyword == 'AajTak' ){
		
		var URI = "http://m.aajtak.in/index.jsp", // define URI first
			keyword = keyword,
			main_url = "http://m.aajtak.in/"; 

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
				$ul = $('ul#navigations');
				$li = $ul.children('li');
					 
			$li.each(function (i, item) {
				var $tab = $(item).children('a').text().trim(),
					$href = main_url + $(item).children('a').attr("href");
					
				//if($tab == "Home" || $tab == "News" || $tab == "Business" || $tab == "Sport"){	
					//and add all that data to my items array
					self.tabs.push({
						keyword : 'AajTak',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					});
				//}
				
			 });		
			//console.log(self.tabs);
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
			//getTabsData(self.tabs)
		});
	} 
	<!-- AajTak - End -->
	
	<!-- BBCHindi -->
	if(keyword == 'BBCHindi' ){
		
		var URI = "http://www.bbc.co.uk/hindi/", // define URI first
			keyword = keyword,
			main_url = "http://www.bbc.co.uk"; 

		request({
		  uri: URI,
		}, function(error, response, body) {
			//console.log(response)
			var self = this;
			self.tabs = new Array();//I feel like I want to save my results in an array

			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}

			var $ = cheerio.load(body),
				$div = $("div#blq-local-nav"),
				$ul = $div.children('ul'),
				$li = $ul.find('li');
			//console.log($ul)		 
			$li.each(function (i, item) {
				var $tab = $(item).children('a').text().trim(),
					$href = main_url + $(item).children('a').attr("href");
					
				if($tab == "समाचार" || $tab == "भारत" || $tab == "विदेश" || $tab == "मनोरंजन" || $tab == "खेल"){	
					//and add all that data to my items array
					self.tabs.push({
						keyword : 'BBCHindi',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					});
				}
				
			 });		
			//console.log(self.tabs);
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
			//getTabsData(self.tabs)
		});
	} 
	<!-- BBCHindi - End -->
	
	// english news
	
	<!-- TheHindu -->
	if(keyword == 'TheHindu' ){
		
		var URI = "http://www.thehindu.com/", // define URI first
			keyword = keyword; 

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
				$ul=$('#nav-bar').children('a');
					 
			$ul.each(function (i, item) {
				var $tab = $(item).text(),
					$href = $(item).attr("href");
					
				if($tab == "Home" || $tab == "News" || $tab == "Business" || $tab == "Sport"){	
					//and add all that data to my items array
					self.tabs.push({
						keyword : 'TheHindu',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					});
				}
				//setTimeout(getTabsData(self.tabs),3000);
				//console.log("gujaratsamachar");
			 });		
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
			//console.log(self.tabs);
			//getTabsData(self.tabs)
		});
	} 
	<!-- TheHindu - end -->

	<!-- IBNLive -->
	if(keyword == 'IBNLive' ){
		
		var URI = "http://ibnlive.in.com/", // define URI first
			keyword = keyword; 

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
				$ul=$('#nav_box').children('ul').find('a');
				//console.log($ul);
					 
			$ul.each(function (i, item) {
				var $tab = $(item).text(),
					$href = $(item).attr("href");
					
				if($tab == "Politics" || $tab == "India" || $tab == "Sports" || $tab == "World"){	
					//and add all that data to my items array
					self.tabs.push({
						keyword : 'IBNLive',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					});
				}
				//setTimeout(getTabsData(self.tabs),3000);
				//console.log("gujaratsamachar");
			 });		
			res.render('list', {title: 'NewsHunt - '+keyword, items : self.tabs} );
			//console.log(self.tabs);
			//getTabsData(self.tabs)
		});
	} 
	<!-- IBNlive end -->	
	
	<!-- deccanherald -->
	if(keyword == 'deccanherald' ){
		
		var URI = "http://www.deccanherald.com/", // define URI first
			keyword = keyword; 

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
				$ul = $('#menu ul#nav'),
				$li = $ul.children('li');
					 
			$li.each(function (i, item) {
				var $tab = $(item).children('a').text().trim(),
					$href = $(item).children('a').attr("href");
					//console.log($tab,$href);
					
				if($tab == "Home" || $tab == "News" || $tab == "Business" || $tab == "Sports"  || $tab == "Entertainment"){	
					if($tab == 'Home'){
						$href = URI;						
					}
					if($tab == 'News'){
						$tab = $(item).children('ul').children('li:nth-child(4)').children('a').text().trim();
						$href = $(item).children('ul').children('li:nth-child(4)').children('a').attr('href');
					}
					//and add all that data to my items array
					self.tabs[i] = {
						keyword : 'deccanherald',
						uri : URI,
						tabs_title : $tab,	
						tabs_href: $href					
					};
				}
				
				//setTimeout(getTabsData(self.tabs),3000);
			 });
			 //res.send(self.tabs);		
			res.render('list', {title: 'NewsHunt - '+ keyword, items : self.tabs} );
			//getTabsData(self.tabs)
		});
	}*/
	<!-- deccanherald - end -->
	
};