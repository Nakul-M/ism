const express = require('express');
const router = express.Router();
const Student = require('../../models/student');
const ClassMonthlyFee = require('../../models/ClassMonthlyFee');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const FeeStatus = require('../../models/StudentFeeStatus');
const mongoose = require('mongoose');
// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.put('/dashboard', async (req, res) => {
  try {
    const { studentName, studentDateofbirth } = req.body;

    const student = await Student.findOne({
      name: studentName.toUpperCase(),
      dateOfBirth: studentDateofbirth
    });

    if (!student) {
      req.flash('error', 'Invalid name or date of birth');
      return res.redirect('/student/login');
    }
         req.session.student = student;
    // If found, redirect to dashboard
        req.flash('success', 'Logged in successfully');
    res.redirect(`/student/${student._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.render('student/dashboard', { showFooter: false, student });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View student results
router.get('/:id/results', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    res.render('student/results', {
      student,
      marks: student.marks,
      showFooter: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id/profile', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      req.flash('error', 'Student not found');
      return res.redirect('/login/student');
    }

    res.render('student/profile', {
      student,
      showFooter: false
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/student/login');
  }
});

// GET fees page for student
router.get('/:id/fees', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    // Get class fee structure
    const classFees = await ClassMonthlyFee.findOne({ class: student.class });
    if (!classFees || !classFees.monthlyFees) {
      return res.status(404).send('Class fees not found or incomplete');
    }

    // Get student's payment status or create if not exists
    let feeStatus = await FeeStatus.findOne({ studentId: student._id });
    if (!feeStatus) {
      feeStatus = new FeeStatus({
        studentId: student._id,
        fees: {} // match your DB field
      });
      await feeStatus.save();
    }

    // Merge fee amount with payment status
    const months = Object.keys(classFees.monthlyFees || {}).map(month => ({
      name: month,
      amount: classFees.monthlyFees?.[month] ?? 0,
      status: feeStatus.fees?.[month] || 'Unpaid' // now reading from .fees
    }));

    res.render('student/fees', {
      student,
      months,showFooter: false,
      monthlyFees: classFees.monthlyFees,
      studentFeeStatus: { fees: feeStatus.fees || {} }, // match EJS expectations
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// POST to create Razorpay order for a month
router.post('/:id/pay/:month', async (req, res) => {
  try {
    const { id, month } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const classFees = await ClassMonthlyFee.findOne({ class: student.class });
    if (!classFees || !classFees.monthlyFees) {
      return res.status(404).json({ error: 'Class fees not found' });
    }

    const amount = classFees.monthlyFees?.[month];
    if (amount === undefined || amount <= 0) {
      return res.status(400).json({ error: 'Invalid month or amount' });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `${id}-${month}`.slice(0, 40)
    });

    res.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      month,
      studentId: id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while initiating payment.' });
  }
});

// POST route for verifying payment and updating fee status
router.post('/:id/payment-success', async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, month } = req.body;

    // Verify payment signature
    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Find or create fee status record for student
    let feeStatus = await FeeStatus.findOne({ studentId: id });
    if (!feeStatus) {
      feeStatus = new FeeStatus({ studentId: id });
    }

    // Update the month to "Paid"
    if (feeStatus.fees[month] === undefined) {
      return res.status(400).json({ error: 'Invalid month' });
    }
    feeStatus.fees[month] = 'Paid';
    await feeStatus.save();

    res.json({ success: true, message: `${month} fee marked as Paid` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while verifying payment' });
  }
});


module.exports = router ;