const express= require("express" );
const router = express.Router();
const ClassMonthlyFee = require('../../models/ClassMonthlyFee');

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
router.get('/feeStructure', async(req, res) => {
   const classFee  = await ClassMonthlyFee.find({});
  res.render('navbar/feeStructure' , {classFee} );
});
module.exports = router ;