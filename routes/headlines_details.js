var request = require('request')
, url = require('url') 
, cheerio = require("cheerio");

// import database
var mongo = require('mongodb');

exports.headlines = function(req, res){
	
	var queryObject = url.parse(req.url,true).query;
  	var keyword = queryObject.keyword;
  	var headlines_href = queryObject.href;
		
	db.collection('scrape', function(err, collection) {
        collection.find({"scrape_href":headlines_href}).toArray(function(err, items) {
			 //console.log(items);
			 res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : items} );
            //res.send(items);
        });
    });
	
	/*if(keyword == 'sandesh'){
					
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
				var $headlines_title = $('span#lblHeading').text().trim(),
					$headlines_date = $('span#lblDate').text().trim(),
					$headlines_img = tab_url+$('img#imgNews').attr('src'),
					$articleCont = $('span#lblNews').text().trim();						
									
				//and add all that data to my items array
				self.headlinesData.push({
					keyword : keyword,
					//tabs_title : tabs_title,
					//tabs_href : tabs_href, 
					headlines_title : $headlines_title,
					headlines_href : headlines_href,
					headlines_img : $headlines_img,
					headlines_content : $articleCont,
					headlines_date : $headlines_date								
				});
			});
			res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
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
					var $headlines_title = $(item).children('h1.fittext1').html(),
						$title2 = $(item).children('h2.fittext2').html(),
						$title3 = $(item).children('h3.fittext2').html(),
						
						//$title = $title+"&lt;br /&gt;"+ $title2 +"&lt;br /&gt;"+ $title3;
						$articleCont = $(item).children('span.fittext3').text().trim(),
						$headlines_img = $(item).children('span.fittext3').find('img').attr('src');					
										
					//and add all that data to my items array
					self.headlinesData.push({
						keyword : keyword,
						//tabs_title : tabs_title,
						//tabs_href : tabs_href, 
						headlines_title : $headlines_title,
						headlines_href : headlines_href,
						headlines_img : $headlines_img,
						headlines_content : $articleCont								
					});
				});
				res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}
	
	<!-- deshgujarat -->
	if(keyword == 'deshgujarat'){
					
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
				$articleClass = $('#main .content'),
				$headlines_title = $articleClass.find('h2.title').text().trim(),
				$headlines_date = $articleClass.find('span.meta_date').text().trim();
				$pTag = $articleClass.find('.entry p'),
				$articleCont = '',
				$headlines_img = $articleClass.find('.entry p').children('img').attr('src');
				
				if(!$headlines_img){
					$headlines_img = '';
				}
				
			 $pTag.each(function (i, item) {
			 
				//I will use regular jQuery selectors
					$articleCont += $(item).text().trim();		
				//and add all that data to my items array
				
			});
			self.headlinesData.push({
				keyword : keyword,
				//tabs_title : tabs_title,
				//tabs_href : tabs_href, 
				headlines_title : $headlines_title,
				headlines_href : headlines_href,
				headlines_img : $headlines_img,
				headlines_content : $articleCont,
				headlines_date : $headlines_date								
			});
			//console.log(self.headlinesData);
			res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}
	<!-- deshgujarat - end -->
	
	// hindi news
	
	<!-- AajTak -->
	if(keyword == 'AajTak'){
		
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
				$articleTitle = $('.secArticleTitle').text().trim(),
				$articleTime = $('.pubTime').text().trim(),
				$articleImage = $('.secArticleImage img').attr('src'),
				$articleCont = $('.storyBody').text().trim();
			
				//and add all that data to my items array
				self.headlinesData.push({
					keyword : keyword,
					headlines_title : $articleTitle,
					headlines_href : headlines_href,
					headlines_img : $articleImage,
					headlines_content : $articleCont,
					headlines_date : $articleTime						
				});
				//console.log($headlines_date);	
				res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}
	<!-- AajTak - end -->
	
	
	<!-- BBCHindi -->
	if(keyword == 'BBCHindi'){		
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
				$mainClass = $('#blq-content').find('div.g-container'),			  
				$articleTitle = $mainClass.children('h1').text().trim(),
				$articleTime = $mainClass.children('div.datestamp').text().trim(),datestamp
				$articleImage = $mainClass.children('div.bodytext').children('div.module:nth-child(1)').find('img').attr('src');
				$articleCont = $mainClass.children('div.bodytext').children('p').text().trim();	
			
				//and add all that data to my items array
				self.headlinesData.push({
					keyword : keyword,
					headlines_title : $articleTitle,
					headlines_href : headlines_href,
					headlines_img : $articleImage,
					headlines_content : $articleCont,
					headlines_date : $articleTime						
				});
				//console.log(self.headlinesData);	
				res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}	
	<!-- BBCHindi - end -->
	
	
	
	// english news
	
	<!-- TheHindu start -->
	if(keyword == 'TheHindu'){
		
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
				$articleClass = $('#left-column');
			
				$articleClass.each(function (i, item) {
					 
					//I will use regular jQuery selectors
					var $headlines_title = $(item).children('h1.detail-title').html(),
						
						//$title = $title+"&lt;br /&gt;"+ $title2 +"&lt;br /&gt;"+ $title3;
						$articleCont = $(item).find('.article-text .body').text().trim(),
						$headlines_img = $(item).children('.art-horizantal-colored').children('#hcenter').find('img').attr('src'),					
						$headlines_date = $(item).find('.dateline').text().trim();	
					//and add all that data to my items array
					self.headlinesData.push({
						keyword : keyword,
						headlines_title : $headlines_title,
						headlines_href : headlines_href,
						headlines_img : $headlines_img,
						headlines_content : $articleCont,
						headlines_date : $headlines_date						
					});
					//console.log($headlines_date);	
				});
				res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}
	<!-- TheHindu end -->

	<!-- IBNLive start -->
	if(keyword == 'IBNLive'){
		
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
				$articleClass = $('#aright');
			
				$articleClass.each(function (i, item) {
					 
					//I will use regular jQuery selectors
					var $headlines_title = $(item).find('h1').html(),
						
						//$title = $title+"&lt;br /&gt;"+ $title2 +"&lt;br /&gt;"+ $title3;
						$articleCont = $(item).find('.acbox p').text().trim(),
						$headlines_img = $(item).find('#photo img').attr('src'),					
						$headlines_date = $(item).find('.img_box.txtb12.fleft span').text();
						//console.log($(item).find('.img_box.txtb12.fleft span').text());	
					//and add all that data to my items array
					self.headlinesData.push({
						keyword : keyword,
						headlines_title : $headlines_title,
						headlines_href : headlines_href,
						headlines_img : $headlines_img,
						headlines_content : $articleCont,
						headlines_date : $headlines_date						
					});
					//console.log($headlines_date);	
				});
				res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}
	<!-- IBNLive end -->
	
	<!-- deccanherald -->
	if(keyword == 'deccanherald'){
					
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
				$articleClass = $('#main .newsText'),
				$headlines_title = $articleClass.children('h1').text().trim(),
				$headlines_date = $articleClass.children('.postedBy').text().trim();
				$pTag = $articleClass.children('p:not(.gotoTop)'),
				$articleCont = '',
				$headlines_img = $articleClass.children('figure.floatLeftImg').children('img').attr('src');
				
				if(!$headlines_img){
					$headlines_img = '';
				}
				
			 $pTag.each(function (i, item) {
			 
				//I will use regular jQuery selectors
					$articleCont += $(item).text().trim();		
				//and add all that data to my items array
				
			});
			self.headlinesData.push({
				keyword : keyword,
				//tabs_title : tabs_title,
				//tabs_href : tabs_href, 
				headlines_title : $headlines_title,
				headlines_href : headlines_href,
				headlines_img : $headlines_img,
				headlines_content : $articleCont,
				headlines_date : $headlines_date								
			});
			//console.log(self.headlinesData);
			res.render('headlines_details', {title: 'NewsHunt - HeadLines Details', items : self.headlinesData} );
		});
	}*/
	<!-- deccanherald - end -->

		
	
};