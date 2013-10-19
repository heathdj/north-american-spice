
var passport = require('passport'),
    pass = require('../config/pass'),
    db = require('../config/dbschema');

exports.account = function(req, res) {
  res.render('account', { title: 'VFD',
  	user: req.user });
};

exports.getlogin = function(req, res) {
 var remembered = false;
 var username = "";
 if (req.cookies.remember_me) {
  remembered = true;
  username = req.cookies.remember_me;
 } 
 res.render('login', {
 	user: username, 
  remember: remembered,
 	message: req.flash('info') 
 });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//   
/***** This version has a problem with flash messages
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });
*/
  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
exports.postlogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('info', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // issue a remember me cookie if the option was checked
      if (!req.body.remember_me) { 
        res.clearCookie('remember_me'); 
      } else {
        res.cookie('remember_me', req.user.username, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      }
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.getsignup = function(req, res) {
    res.render('signup', {
    	title: 'VFD',
    	user: req.user, 
    	message: req.flash('info')
    });
};

exports.signup = function (req, res) {
    var body = req.body;
    pass.createUser(
        body.username,
        body.email,
        body.password,
        body.password2,
        false,
        function (err, user) {
            if (err) return res.render('signup', { 
            	user: req.user, 
            	message: err.code === 11000 ? "User already exists" : err.message 
            });
            req.login(user, function (err) {
                if (err) return next(err);
                // successful login
                res.redirect('/');
            })
        })
}