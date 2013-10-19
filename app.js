
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var account = require('./routes/account');
var http = require('http');
var path = require('path');

var Mongoose = require('mongoose');
var MongoStore = require('connect-mongo') (express);
var db = require('./config/dbschema');
var flash = require('connect-flash');
var pass = require('./config/pass');
var passport = require('passport');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('silibug condomworm'));
//app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.session({ secret: 'woolybooger caddis',
	maxAge : new Date(Date.now() + 3600000),
	store: new MongoStore(
		{db:Mongoose.connection.db},
		function(err){
			console.log(err || ' connect-mongodb setup ok');
		})
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/zxcvbn', express.static('node_modules/zxcvbn/zxcvbn'));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('/secure', pass.ensureAuthenticated);
app.all('/secure/admin', pass.ensureAdmin);
app.get('/', routes.index);
app.get('/login', user.getlogin);
app.post('/login', user.postlogin);
app.get('/logout', user.logout);
// Signup pages
app.get('/signup', user.getsignup);
app.post('/signup', user.signup);
// Secure pages
app.get('/secure/account', user.account);

app.get('/secure/admin', user.admin);
//app.post('/login',
//	passport.authenticate('local', {sucessReturnToOrRedirect: '/',
//									failureRedirect: '/login',
//									failureFlash: 'Invalid username or password'}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
