const express= require("express" );
const router = express.Router();
const passport = require('passport');

router.get('/' , (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect('/admin/dashboard');
    }
    req.flash("success", "Logged out successfully");
    res.redirect('/index');
  });
});

module.exports = router ;