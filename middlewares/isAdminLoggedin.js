module.exports = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in first');
  res.redirect('/login/admin');
};
