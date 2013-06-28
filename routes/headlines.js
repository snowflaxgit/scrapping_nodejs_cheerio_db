var request = require('request')
, url = require('url');

var cheerio = require("cheerio");
// import database
var mongo = require('mongodb');

exports.tabs = function(req, res){
	//var uri = req.params.url;
	
	var queryObject = url.parse(req.url,true).query;
  	var keyword = queryObject.keyword;
  	var tabs_href = queryObject.href;
	
	//console.log(queryObject);
	db.collection('scrape', function(err, collection) {
        collection.find({'scrape_tabs_href':tabs_href}).toArray(function(err, items) {
			//console.log(items);
			 res.render('headlines', {title: 'NewsHunt - Headlines', items : items} );
            //res.send(items);
        });
    });		
	
	/*if(keyword == 'sandesh'){
						
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
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
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
					headlines_img : $img								
				};
			});
			 res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
		});
	}

	if(keyword == 'gujaratsamachar'){	
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
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
				var $img = $(item).children('div.imgbox').children('a').children('img').attr("src"),
					$title = $(item).children('div.viru404-hit420').children('a.mr-href-title').text().trim(),
					$href = $(item).children('div.viru404-hit420').children('a.mr-href-title').attr('href');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
					headlines_img : $img								
				};
			});
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
			
		});
	}
	
	<!-- deshgujarat -->
	if(keyword == 'deshgujarat'){	
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}

			var $ = cheerio.load(body),			  
				$divCont = $('#content-wrap2 .content'),
				$divPost = $divCont.find('div.post-wrap');
					
			$divPost.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).find('h2.title1').find('a').text().trim(),
					$href = $(item).find('h2.title1').find('a').attr('href');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href							
				};
			});
			//res.send(self.tabData);
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
			
		});
	}
	<!-- deshgujarat - end -->
	
	// hindi news
	
	<!-- AajTak -->
	if(keyword == 'AajTak'){
		
		var main_url = "http://m.aajtak.in/";
		
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}
			
			var $ = cheerio.load(body),
				$table = $("table.newsListing"),
				$tr = $table.find('tr');			
			
			$tr.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).children('td').children('a').text().trim(),
					$href = main_url + $(item).children('td').children('a').attr('href');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
				};
			});
			//console.log(self.tabData);
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
				
		});
	}
	<!-- AajTak - End -->
	
	<!-- BBCHindi -->
	if(keyword == 'BBCHindi'){
		
		var main_url = "http://www.bbc.co.uk";
		
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}
			
			var $ = cheerio.load(body),
				$div = $("div#blq-content"),
				$teaserDiv = $div.find('div.g-container').children('div.teaser');			
			
			$teaserDiv.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).children('h2').children('a').text().trim(),
					$href = main_url + $(item).children('h2').children('a').attr('href'),
					$img = $(item).children('h2').children('a').children('img').attr('src');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
					headlines_img : $img
				};
			});
			//console.log(self.tabData);
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
				
		});
	}		
	<!-- BBCHindi - end -->
	
	
	//english
	
	<!-- TheHindu Start -->
	if(keyword == 'TheHindu'){
		//console.log(keyword,tabs_title,tabs_href);	
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}
			var $ = cheerio.load(body);
								
			if(tabs_href == 'http://www.thehindu.com/')
			{
				var $div = $('.breakingNews_list').children('h3').children('a');
			}
			
			if(tabs_href == 'http://www.thehindu.com/news/')
			{
				var $div = $('.breakingNews_list').children('h3').children('a');
			}
			
			if(tabs_href == 'http://www.thehindu.com/business/')
			{
				var $div = $('.headlines').children('h3').find('a');
			}
			
			if(tabs_href == 'http://www.thehindu.com/sport/')
			{
				var $div = $('.headlines').children('h3').find('a');
			}
			
			$div.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).text().trim(),
					$href = $(item).attr('href');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
				};
			});
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
				
		});
	}
	<!-- TheHindu End -->

	<!-- IBNLive Start -->
	if(keyword == 'IBNLive'){
		//console.log(keyword,tabs_title,tabs_href);	
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}
			var $ = cheerio.load(body);
								
			if(tabs_href == 'http://ibnlive.in.com/politics/')
			{
				var $div = $('.lft-wd1').children('.read-ls1').find('a');
			}
			
			if(tabs_href == 'http://ibnlive.in.com/india/')
			{
				var $div = $('#cntnt').children('.nbox').children('h2').children('a');
			}
			
			if(tabs_href == 'http://ibnlive.in.com/sports/')
			{
				var $div = $('.mid_left.fleft ul').children('li').children('h2').children('a');
			}
			
			if(tabs_href == 'http://ibnlive.in.com/world/')
			{
				var $div = $('#cntnt').children('.nbox').children('h2').children('a');
			}
			
			$div.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).text(),
					$href = $(item).attr('href');
					//$img = $(item).children('img').attr('src');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href
					//headlines_img : $img
				};
				//console.log($img);
			});
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
				
		});
	}
	<!-- IBNLive End -->
	
	<!-- deccanherald -->
	if(keyword == 'deccanherald'){
		request({
		  uri: tabs_href,
		}, function(error, response, body) {
			
			var self = this;
			self.tabData = new Array();//I feel like I want to save my results in an array
			
			//Just a basic error check
			if(error && response.statusCode !== 200){
				console.log('Request error.');
			}

			var $ = cheerio.load(body),			  
				$divCont = $('div#topBlockLeft'),
				$divPost = $divCont.find('div.newsText');
					
			$divPost.each(function (i, item) {
				 
				//I will use regular jQuery selectors
				var $title = $(item).children('h2').children('a').text().trim(),
					$href = $(item).children('h2').children('a').attr('href'),
					$headlines_img = $(item).find('figure img').attr('src');
					//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
					//console.log($headlines_img);
				
				if(!$headlines_img){
					$headlines_img = '';
				}					
				
				//and add all that data to my items array
				self.tabData[i] = {
					keyword : keyword,
					headlines_title : $title,
					headlines_href : $href,
					headlines_img	: $headlines_img						
				};
			});
			//res.send(self.tabData);
			res.render('headlines', {title: 'NewsHunt - Headlines', items : self.tabData} );
			
		});
	}*/
	<!-- deccanherald - end -->
	
};