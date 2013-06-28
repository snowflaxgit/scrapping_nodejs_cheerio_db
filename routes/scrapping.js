var DBManager = require("../routes/db_manager")
   	, cheerio = require("cheerio")
	, http = require('http-get')
	, mkpath = require('mkpath');

//console.log(__dirname);
//DBManager.newspaper('heloo....');

var request = require('request')
, url = require('url');

function uploadLogoImage(keyword, url, callback){
	
	var dir_path = '/images/NewPapers/logo',	
		imagePath = './public/images/NewPapers/logo';
		//default_img_path = '/images/default/noimage.jpg';

	if(url && url != null){
		//console.log("==========>>>>>>>>>>>>>url : "+url);
		var fileNameIndex = url.lastIndexOf("/") + 1
			, filename = keyword+"_"+url.substr(fileNameIndex)
			, options = {url: url};	
		
		mkpath(imagePath, function (err) {
			if (err) {
				console.log(err);
			}
			else{
				//console.log('Directory structure '+imagePath +' created');
			}
		});	
		mkpath.sync(imagePath, 0777);	
						
		imagePath = imagePath+'/'+filename;
		
		http.get(options, imagePath, function (error, result) {
			if (error) {
				console.error(error);
			} else {
				//console.log('File downloaded at: ' + result.file);
				callback(dir_path+'/'+filename);
			}
		});
	}
	else{
		callback(null);	
	}
	
};

function uploadImage(keyword, url, callback){
	
	var date = new Date(),
		dd = date.getDate(),
		mm = date.getMonth()+1,
		yy = date.getFullYear();
		
	if (mm < 10) { mm = '0' + mm; }
		
	var dmy = dd+mm+yy,
		randNo = Math.floor((Math.random()*9999)),		
		date_randNo = dmy + randNo;			
				 
	//console.log(date_randNo);
		
	DBManager.getNewsPaperID(keyword, function(newspaperID){
		//console.log("newspaperID : "+newspaperID);		
		
		var dir_path = '/images/NewPapers/'+newspaperID;	
		var imagePath = './public/images/NewPapers/'+newspaperID;
		var default_img_path = '/images/default/noimage.jpg';
	
		if(url){
			//console.log("==========>>>>>>>>>>>>>url : "+url);
			var fileNameIndex = url.lastIndexOf("/") + 1
				, filename = date_randNo+"_"+url.substr(fileNameIndex)
				, options = {url: url};	
			
			mkpath(imagePath, function (err) {
				if (err) {
					console.log(err);
				}
				else{
					//console.log('Directory structure '+imagePath +' created');
				}
			});	
			mkpath.sync(imagePath, 0777);	
							
			imagePath = imagePath+'/'+filename;
			
			http.get(options, imagePath, function (error, result) {
				if (error) {
					console.error(error);
				} else {
					//console.log('File downloaded at: ' + result.file);
					callback(dir_path+'/'+filename);
				}
			});
		}
		else{
			callback(default_img_path);	
		}
		
	});
}

var keyword = ['TheHindu','IBNLive','DeccanHerald','BBCHindi','AajTak','Sandesh','GujaratSamachar','DeshGujarat'],
	keyTabs = new Array(),
	keyHeadlines = new Array(),
	KeyHeadlinesDetails = new Array(),
	arrTabs = new Array(),
	arrHeadlines = new Array(),
	arrHeadlinesDetails = new Array(),
	newsFlags = new Array();
		
function NewsPaper(){
	
	keyTabs = [];
	keyHeadlines = [];
	KeyHeadlinesDetails = [];
	arrTabs = [];
	arrHeadlines = [];
	arrHeadlinesDetails = [];
	newsFlags = [];
		
	var i = 0;
	
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < keyword.length) {
				var newspaper = keyword[i];
				switch(newspaper){
					<!-- sandesh -->
					case 'Sandesh' :											
						var URI = "http://www.sandesh.com/"; 
						
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
														
							var $ = cheerio.load(body),
								$logo = $('img.marginlogo').attr('src');
							
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
							
						});
						break;
					<!-- sandesh - end -->
				
					<!-- gujaratsamachar -->
					case 'GujaratSamachar' :						
						var URI = "http://www.gujaratsamachar.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo = $('#header .logo').children('a').children('img').attr('src');
									 
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);		
								newsFlags.push(newspaper);						
							});
						});
						break;
					<!-- gujaratsamachar - end -->
					
					<!-- deshgujarat -->
					case 'DeshGujarat' :						
						var URI = "http://g.deshgujarat.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo = $('#headertable').find('img.logo').attr('src');
									 
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break;
					<!-- deshgujarat - end -->
					
					// hindi news
					
					<!-- AajTak -->
					case 'AajTak' :						
						var URI = "http://m.aajtak.in/index.jsp",
							main_url = "http://m.aajtak.in/"; 
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo='';
									 
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break; 
					<!-- AajTak - End -->
					
					<!-- BBCHindi -->
					case 'BBCHindi' :						
						var URI = "http://www.bbc.co.uk/hindi/",
							main_url = "http://www.bbc.co.uk"; 
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							var self = this;
							self.tabs = new Array();
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo = $("#blq-blocks").children('a').find('img').attr('src');	 
							
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break;
					<!-- BBCHindi - End -->
					
					// english news
					
					<!-- TheHindu -->
					case 'TheHindu' :						
						var URI = "http://www.thehindu.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo = $("#headerlogo").children('a').children('img').attr('src');	 							
							
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break;
					<!-- TheHindu - end -->
				
					<!-- IBNLive -->
					case 'IBNLive' :						
						var URI = "http://ibnlive.in.com/"; 
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$logo='';
									 
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break;
					<!-- IBNlive end -->	
					
					<!-- deccanherald -->
					case 'DeccanHerald' :						
						var URI = "http://www.deccanherald.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
							
							var $ = cheerio.load(body),
								$logo = $("#logo").children('a').children('img').attr('src');
									 
							uploadLogoImage(newspaper, $logo, function(path){										 
								self.tabs.push({
									newspaper_name : newspaper,
									newspaper_logo : path													
								});		
								//console.log(newspaper,self.tabs);
								DBManager.saveNewsPaper(newspaper,self.tabs);
								newsFlags.push(newspaper);
							});
						});
						break;
					<!-- deccanherald - end -->
					default :
						//console.log("default");
						break;	
				}
				myLoop();
			}	
			i++;
		},300);	
	}
	myLoop();
	
	// check for when call ScrapeTabs() 
	setInterval(function(){
		console.log("NewsPaper is running. newsFlags : "+newsFlags.length+" keyword.length: "+keyword.length);
		if(newsFlags.length == keyword.length || newsFlags.length > keyword.length){
			ScrapeTabs();
			
			newsFlags = [];
			
			clearInterval(this);
		}
	},keyword.length*300);
	
}

/* ============================================================== Scrape() ================================================================== */
function ScrapeTabs(){
	var i = 0;	
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < keyword.length) {
				var newspaper = keyword[i];
				switch(newspaper){
					<!-- sandesh -->
					case  'Sandesh' :
						
						var URI = "http://www.sandesh.com/";
						
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$topNav = $('.topNav'),
								$li = $('ul.topnav > li');
										
							$li.each(function (i, item) {
								var $tab = $(item).children('a').text(),
									$href = URI + $(item).children('a').attr("href");
										
								if($tab == "National" || $tab == "Business" || $tab == "Life" || $tab == "World"  || $tab == "Sports"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,
										scrape_tabs_href: $href						
									});
								}
							});
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break; 
					<!-- sandesh - end -->
				
					<!-- gujaratsamachar -->
					case  'GujaratSamachar' :
						
						var URI = "http://www.gujaratsamachar.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$ul=$('ul.menu'),
								$li=$('ul.menu > li');
									 
							$li.each(function (i, item) {
								var $tab = $(item).children('a').text(),
									$href = $(item).children('a').attr("href");
									
								if($tab == "National" || $tab == "Business" || $tab == "International" || $tab == "Entertainment"  || $tab == "Sports"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}
							 });								
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break; 
					<!-- gujaratsamachar - end -->
					
					<!-- deshgujarat -->
					case  'DeshGujarat' :
						
						var URI = "http://g.deshgujarat.com/"; // define URI first
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$ul=$('#container .menus'),
								$li=$('#container .menus .cat-item');
									 
							$li.each(function (i, item) {
								var $tab = $(item).children('a').text(),
									$href = $(item).children('a').attr("href");
									
								if($tab == "ગુજરાત" || $tab == "બિઝનસ" || $tab == "રાજકાજ" || $tab == "પ્રવાસન"  || $tab == "બોલીવૂડ"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}
							 });
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break;
					<!-- deshgujarat - end -->
					
					// hindi news
					
					<!-- AajTak -->
					case  'AajTak' :
						
						var URI = "http://m.aajtak.in/index.jsp", // define URI first
							main_url = "http://m.aajtak.in/"; 
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$ul = $('ul#navigations');
								$li = $ul.children('li');
									 
							$li.each(function (i, item) {
								var $tab = $(item).children('a').text().trim(),
									$href = main_url + $(item).children('a').attr("href");
									
								//if($tab == "Home" || $tab == "News" || $tab == "Business" || $tab == "Sport"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								//}
								
							 });
							//console.log(newspaper,self.tabs);
							keyTabs.push(newspaper);
						});
					break;
					<!-- AajTak - End -->
					
					<!-- BBCHindi -->
					case  'BBCHindi' :
						
						var URI = "http://www.bbc.co.uk/hindi/",
							main_url = "http://www.bbc.co.uk"; 
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							//console.log(response)
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}								
							 });
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break; 
					<!-- BBCHindi - End -->
					
					// english news
					
					<!-- TheHindu -->
					case  'TheHindu' :
						
						var URI = "http://www.thehindu.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$ul=$('#nav-bar').children('a');
									 
							$ul.each(function (i, item) {
								var $tab = $(item).text(),
									$href = $(item).attr("href");
									
								if($tab == "Home" || $tab == "News" || $tab == "Business" || $tab == "Sport"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}
							 });	
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break; 
					<!-- TheHindu - end -->
				
					<!-- IBNLive -->
					case  'IBNLive' :
						
						var URI = "http://ibnlive.in.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$ul=$('#nav_box').children('ul').find('a');
								//console.log($ul);
									 
							$ul.each(function (i, item) {
								var $tab = $(item).text(),
									$href = $(item).attr("href");
									
								if($tab == "Politics" || $tab == "India" || $tab == "Sports" || $tab == "World"){	
									//and add all that data to my items array
									arrTabs.push({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}
							 });	
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break; 
					<!-- IBNlive end -->	
					
					<!-- deccanherald -->
					case  'DeccanHerald' :
						
						var URI = "http://www.deccanherald.com/";
				
						request({
						  uri: URI,
						}, function(error, response, body) {
							
							var self = this;
							self.tabs = new Array();//I feel like I want to save my results in an array
				
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
									arrTabs.push ({
										keyword : newspaper,
										uri : URI,
										scrape_tabs_title  : $tab,	
										scrape_tabs_href: $href					
									});
								}
							 });
							//console.log(newspaper,arrTabs);
							keyTabs.push(newspaper);
						});
					break;
					<!-- deccanherald - end -->
					
					default :
						console.log("default");
						break;	
				}
				myLoop();
			}	
			i++;
		},500);	
	}
	myLoop();
	
	// check for when call ScrapeHeadlines() 
	setInterval(function(){
		console.log("ScrapeTabs is running..keyTabs.length  : "+keyTabs.length +" keyword.length  :"+ keyword.length);
		if(keyTabs.length == keyword.length || keyTabs.length > keyword.length){
			//console.log(arrTabs);			
			ScrapeHeadlines(arrTabs);
			
			keyTabs = [];
			arrTabs = [];
			
			clearInterval(this);
		}
	},keyword.length*300);
	
}

/* ================================================	ScrapeHeadlines()	======================================================== */
function ScrapeHeadlines(arrTabs){
	console.log("arrTabs : "+arrTabs.length);
	var i = 0;
		
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < arrTabs.length) {
				var newspaper = arrTabs[i].keyword,
					uri = arrTabs[i].uri,
					scrape_tabs_title = arrTabs[i].scrape_tabs_title,
					scrape_tabs_href = arrTabs[i].scrape_tabs_href;
					
				switch(newspaper){
					
					case 'Sandesh' :
						
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});										
							});
							keyHeadlines.push(newspaper);							 
						});
					break;
									
					case 'GujaratSamachar' :	
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});
							keyHeadlines.push(newspaper);
						});
					break;		
								
					<!-- deshgujarat -->
					case 'DeshGujarat' :	
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),			  
								$divCont = $('#content-wrap2 .content'),
								$divPost = $divCont.find('div.post-wrap');
									
							$divPost.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $title = $(item).find('h2.title1').find('a').text().trim(),
									$href = $(item).find('h2.title1').find('a').attr('href'),
									$img='';
									//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
													
								//and add all that data to my items array
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});		
							keyHeadlines.push(newspaper);				
						});
					break;
					<!-- deshgujarat - end -->
					
					// hindi news
					
					<!-- AajTak -->
					case 'AajTak' :
						
						var main_url = "http://m.aajtak.in/";
						
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
							
							var $ = cheerio.load(body),
								$table = $("table.newsListing"),
								$tr = $table.find('tr');			
							
							$tr.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $title = $(item).children('td').children('a').text().trim(),
									$href = main_url + $(item).children('td').children('a').attr('href'),
									$img='';
									//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
													
								//and add all that data to my items array
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});
							keyHeadlines.push(newspaper);
						});
					break;
					<!-- AajTak - End -->
					
					<!-- BBCHindi -->
					case 'BBCHindi' :
						
						var main_url = "http://www.bbc.co.uk";
						
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});
							keyHeadlines.push(newspaper);
						});
					break;		
					<!-- BBCHindi - end -->					
					
					//english
					
					<!-- TheHindu Start -->
					case 'TheHindu' :
						//console.log(keyword,tabs_title,scrape_tabs_href);	
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
							var $ = cheerio.load(body);
												
							if(scrape_tabs_href == 'http://www.thehindu.com/')
							{
								var $div = $('.breakingNews_list').children('h3').children('a');
							}
							
							if(scrape_tabs_href == 'http://www.thehindu.com/news/')
							{
								var $div = $('.breakingNews_list').children('h3').children('a');
							}
							
							if(scrape_tabs_href == 'http://www.thehindu.com/business/')
							{
								var $div = $('.headlines').children('h3').find('a');
							}
							
							if(scrape_tabs_href == 'http://www.thehindu.com/sport/')
							{
								var $div = $('.headlines').children('h3').find('a');
							}
							
							$div.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $title = $(item).text().trim(),
									$href = $(item).attr('href'),
									$img='';
									//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
													
								//and add all that data to my items array
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});
							keyHeadlines.push(newspaper);
						});
					break;
					<!-- TheHindu End -->
				
					<!-- IBNLive Start -->
					case 'IBNLive' :
						//console.log(keyword,tabs_title,scrape_tabs_href);	
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
							var $ = cheerio.load(body);
												
							if(scrape_tabs_href == 'http://ibnlive.in.com/politics/')
							{
								var $div = $('.lft-wd1').children('.read-ls1').find('a');
							}
							
							if(scrape_tabs_href == 'http://ibnlive.in.com/india/')
							{
								var $div = $('#cntnt').children('.nbox').children('h2').children('a');
							}
							
							if(scrape_tabs_href == 'http://ibnlive.in.com/sports/')
							{
								var $div = $('.mid_left.fleft ul').children('li').children('h2').children('a');
							}
							
							if(scrape_tabs_href == 'http://ibnlive.in.com/world/')
							{
								var $div = $('#cntnt').children('.nbox').children('h2').children('a');
							}
							
							$div.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $title = $(item).text(),
									$href = $(item).attr('href'),
									$img='';
									//$img = $(item).children('img').attr('src');
									//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
													
								//and add all that data to my items array
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
								//console.log($img);
							});	
							keyHeadlines.push(newspaper);	
								
						});
					break;
					<!-- IBNLive End -->
					
					<!-- deccanherald -->
					case 'DeccanHerald' :
						request({
						  uri: scrape_tabs_href,
						}, function(error, response, body) {
							
							var self = this;
							self.tabData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),			  
								$divCont = $('div#topBlockLeft'),
								$divPost = $divCont.find('div.newsText');
									
							$divPost.each(function (i, item) {
								 
								//I will use regular jQuery selectors
								var $title = $(item).children('h2').children('a').text().trim(),
									$href = $(item).children('h2').children('a').attr('href'),
									$headlines_img = $(item).find('figure img').attr('src'),
									$img='';
									//$content = $(item).children('div.viru404-hit420').children('div.fittext3').text().trim();						
									//console.log($headlines_img);
								
								if(!$headlines_img){
									$headlines_img = '';
								}					
								
								//and add all that data to my items array
								uploadImage(newspaper, $img, function(path){										 
									arrHeadlines.push({
										keyword : newspaper,
										uri : uri,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_title : $title,
										scrape_href : $href,
										scrape_thumb : path								
									});
								});
							});	
							keyHeadlines.push(newspaper);						
						});
					break;
					<!-- deccanherald - end -->
					
					default :
						console.log("default");
						break;	
				}
				myLoop();
			}	
			i++;
		},1000);	
	}
	myLoop();
	
	// check for when call ScrapeHeadlinesDetails() 
	setInterval(function(){
		console.log("ScrapeHeadlines is running. arrTabs.length : "+arrTabs.length +" keyHeadlines.length : "+keyHeadlines.length);
		if(keyHeadlines.length == arrTabs.length || keyHeadlines.length > arrTabs.length){
			//console.log(arrHeadlines);
			ScrapeHeadlinesDetails(arrHeadlines);
			
			keyHeadlines = [];
			arrTabs = [];
			arrHeadlines = [];
			
			clearInterval(this);
		}
	},10000);
	
}

/* ====================================	ScrapeHeadlinesDetails =================================================*/

function ScrapeHeadlinesDetails(arrHeadlines){
	console.log("arrHeadlines : "+arrHeadlines.length);
	
	var i = 0;	
	function myLoop(){
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called        

			if (i < arrHeadlines.length) {
				var newspaper = arrHeadlines[i].keyword,
					uri = arrHeadlines[i].uri,
					scrape_tabs_title = arrHeadlines[i].scrape_tabs_title,
					scrape_tabs_href = arrHeadlines[i].scrape_tabs_href,
					scrape_title = arrHeadlines[i].scrape_title,
					scrape_href = arrHeadlines[i].scrape_href,
					scrape_thumb = arrHeadlines[i].scrape_thumb;
					
				switch(newspaper){
					
					case 'Sandesh' :
					
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
								uploadImage(newspaper, $headlines_img, function(path){										 
									self.headlinesData.push({
										keyword : newspaper,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_thumb : scrape_thumb,
										scrape_href : scrape_href,	
										scrape_title : scrape_title,
										scrape_largeimage : path,
										scrape_detail_article_text : $articleCont,
										scrape_newstime : $headlines_date								
									});
									//console.log(newspaper,self.tabs);
									DBManager.saveScrape(newspaper,self.headlinesData);
								});								
							});						
						});
					break;
				
					case 'GujaratSamachar' :
						
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
										$headlines_img = $(item).children('span.fittext3').find('img').attr('src'),
										$headlines_date='';					
														
									//and add all that data to my items array
									uploadImage(newspaper, $headlines_img, function(path){										 
										self.headlinesData.push({
											keyword : newspaper,
											scrape_tabs_title  : scrape_tabs_title,	
											scrape_tabs_href: scrape_tabs_href,	
											scrape_thumb : scrape_thumb,
											scrape_href : scrape_href,	
											scrape_title : scrape_title,
											scrape_largeimage : path,
											scrape_detail_article_text : $articleCont,
											scrape_newstime : $headlines_date								
										});
										//console.log(newspaper,self.tabs);
										DBManager.saveScrape(newspaper,self.headlinesData);
									});
								});
								
						});
					break;
					
					<!-- deshgujarat -->
					case 'DeshGujarat' :
									
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
							uploadImage(newspaper, $headlines_img, function(path){										 
								self.headlinesData.push({
									keyword : newspaper,
									scrape_tabs_title  : scrape_tabs_title,	
									scrape_tabs_href: scrape_tabs_href,	
									scrape_thumb : scrape_thumb,
									scrape_href : scrape_href,	
									scrape_title : scrape_title,
									scrape_largeimage : path,
									scrape_detail_article_text : $articleCont,
									scrape_newstime : $headlines_date								
								});
								//console.log(newspaper,self.tabs);
								DBManager.saveScrape(newspaper,self.headlinesData);
							});
							
						});
					break;
					<!-- deshgujarat - end -->
					
					// hindi news
					
					<!-- AajTak -->
					case 'AajTak' :
						
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),			  
								$articleTitle = $('.secArticleTitle').text().trim(),
								$headlines_date = $('.pubTime').text().trim(),
								$headlines_img = $('.secArticleImage img').attr('src'),
								$articleCont = $('.storyBody').text().trim();
							
								//and add all that data to my items array
								uploadImage(newspaper, $headlines_img, function(path){										 
									self.headlinesData.push({
										keyword : newspaper,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_thumb : scrape_thumb,
										scrape_href : scrape_href,	
										scrape_title : scrape_title,
										scrape_largeimage : path,
										scrape_detail_article_text : $articleCont,
										scrape_newstime : $headlines_date								
									});
									//console.log(newspaper,self.tabs);
									DBManager.saveScrape(newspaper,self.headlinesData);
								});
								
						});
					break;
					<!-- AajTak - end -->
					
					
					<!-- BBCHindi -->
					case 'BBCHindi' :	
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
							}
				
							var $ = cheerio.load(body),
								$mainClass = $('#blq-content').find('div.g-container'),			  
								$articleTitle = $mainClass.children('h1').text().trim(),
								$headlines_date = $mainClass.children('div.datestamp').text().trim(),datestamp
								$headlines_img = $mainClass.children('div.bodytext').children('div.module:nth-child(1)').find('img').attr('src');
								$articleCont = $mainClass.children('div.bodytext').children('p').text().trim();	
							
								//and add all that data to my items array
								uploadImage(newspaper, $headlines_img, function(path){										 
									self.headlinesData.push({
										keyword : newspaper,
										scrape_tabs_title  : scrape_tabs_title,	
										scrape_tabs_href: scrape_tabs_href,	
										scrape_thumb : scrape_thumb,
										scrape_href : scrape_href,	
										scrape_title : scrape_title,
										scrape_largeimage : path,
										scrape_detail_article_text : $articleCont,
										scrape_newstime : $headlines_date								
									});
									//console.log(newspaper,self.tabs);
									DBManager.saveScrape(newspaper,self.headlinesData);
								});
								
						});
					break;
					<!-- BBCHindi - end -->
					
					// english news
					
					<!-- TheHindu start -->
					case 'TheHindu' :
						
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
																		
									uploadImage(newspaper, $headlines_img, function(path){										 
										self.headlinesData.push({
											keyword : newspaper,
											scrape_tabs_title  : scrape_tabs_title,	
											scrape_tabs_href: scrape_tabs_href,	
											scrape_thumb : scrape_thumb,
											scrape_href : scrape_href,	
											scrape_title : scrape_title,
											scrape_largeimage : path,
											scrape_detail_article_text : $articleCont,
											scrape_newstime : $headlines_date								
										});
										//console.log(newspaper,self.tabs);
										DBManager.saveScrape(newspaper,self.headlinesData);
									});	
								});
								
						});
					break;
					<!-- TheHindu end -->
				
					<!-- IBNLive start -->
					case 'IBNLive' :
						
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
									uploadImage(newspaper, $headlines_img, function(path){										 
										self.headlinesData.push({
											keyword : newspaper,
											scrape_tabs_title  : scrape_tabs_title,	
											scrape_tabs_href: scrape_tabs_href,	
											scrape_thumb : scrape_thumb,
											scrape_href : scrape_href,	
											scrape_title : scrape_title,
											scrape_largeimage : path,
											scrape_detail_article_text : $articleCont,
											scrape_newstime : $headlines_date								
										});
										//console.log(newspaper,self.tabs);
										DBManager.saveScrape(newspaper,self.headlinesData);
									});	
								});
								
						});
					break;
					<!-- IBNLive end -->
					
					<!-- deccanherald -->
					case 'DeccanHerald' :
									
						request({
						  uri: scrape_href,
						}, function(error, response, body) {
							
							var self = this;
							self.headlinesData = new Array();//I feel like I want to save my results in an array
							
							//Just a basic error check
							try{
								if(error && response.statusCode !== 200){
									console.log('Request error.');
								}								
							}
							catch(e){
								console.log(e);
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
							uploadImage(newspaper, $headlines_img, function(path){										 
								self.headlinesData.push({
									keyword : newspaper,
									scrape_tabs_title  : scrape_tabs_title,	
									scrape_tabs_href: scrape_tabs_href,	
									scrape_thumb : scrape_thumb,
									scrape_href : scrape_href,	
									scrape_title : scrape_title,
									scrape_largeimage : path,
									scrape_detail_article_text : $articleCont,
									scrape_newstime : $headlines_date								
								});
								//console.log(newspaper,self.tabs);
								DBManager.saveScrape(newspaper,self.headlinesData);
							});
							
						});
					break;
					<!-- deccanherald - end -->
			
				default :
						console.log("default");
						break;	
				}
				myLoop();
			}	
			i++;
		},3000);	
	}
	myLoop();
	
	// check for when call 
	/*setInterval(function(){
		console.log("ScrapeHeadlinesDetails is running.....");
		if(arrHeadlines.length == keyHeadlinesDetails.length){
			console.log(arrHeadlinesDetails);
			clearInterval(this);
		}
	},10000);*/
	
}


//check for when call NewsPaper() 
function mainScrapper(){
	console.log("languageDB is running.....");
	if(DBManager.lanFlags.length == 3){
		NewsPaper();
		clearInterval(StartScrapData);
		setInterval(mainScrapper,20*60*1000); 
	}
};
//setTimeout(mainScrapper(),2000); //intial start main function
var StartScrapData = setInterval(mainScrapper,2000);
