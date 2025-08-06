const express = require('express');
const router = express.Router();
const Student = require('../../models/student');

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

module.exports = router ;