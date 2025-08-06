const express= require("express" );
const router = express.Router();
const passport = require('passport');

router.get('/student', (req, res) => {
  res.render('login/student', { showFooter: false }); 
});
router.get('/teacher', (req, res) => {
  res.render('login/teacher', { showFooter: false }); 
});
router.get('/admin', (req, res) => {
  res.render('login/admin', { showFooter: false}); 
});

// Admin login POST
router.post('/admin',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login/admin',
    failureFlash: true
  })
);

module.exports = router ;