
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , page_tabs = require('./routes/headlines')
  , headlines_details = require('./routes/headlines_details')
  , page_list = require('./routes/list')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
, request = require('request')
, url = require('url');

var app = express();

// all environments
app.set('port', process.env.PORT || 3890);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/news_tabs', page_tabs.tabs);
app.get('/headlines_details', headlines_details.headlines);
app.get('/:id', page_list.list);


/*var request = require("request");
request({
	uri: "http://nodejs.org/",
}, function(error, response, body) {
	  console.log(body);
});*/