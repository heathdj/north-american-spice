/*
 * GET account page.
 */

exports.index = function(req, res){
  res.render('account_index', { user_name: req.user.username });
};