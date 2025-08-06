const express= require("express" );
const router = express.Router();

router.get('/index', (req, res) => {
  res.render('index');
});
router.get('/admission', (req, res) => {
  res.render('navbar/admission'); 
});
router.get('/contactus', (req, res) => {
  res.render('navbar/contactus'); 
});
router.get('/aboutus', (req, res) => {
  res.render('navbar/aboutus'); 
});
router.get('/download/HW', (req, res) => {
  res.render('navbar/downloadHW'); 
});
router.get('/transport', (req, res) => {
  res.render('navbar/transport');
});
module.exports = router ;