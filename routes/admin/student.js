const express = require('express');
const router = express.Router();
const Student = require('../../models/student'); // Adjust the path as necessary
const isAdminLoggedin = require('../../middlewares/isAdminLoggedin'); // Adjust the path as necessary

router.use(isAdminLoggedin);

router.get('/' ,async(req, res) => {
  const { name, class: studentClass, section } = req.query;
  const query = {};

  if (name) query.name = { $regex: `^${name}`, $options: 'i' };
  if (studentClass) query.class = parseInt(studentClass);
  if (section) query.section = section;

  const students = Object.keys(query).length > 0
    ? await Student.find(query)
    : [];
  res.render('admin/student/home'  , { showFooter: false , students , query});
});

// Show new student registration form
router.get('/new',async(req, res) => {
  const students = await Student.find({});
  res.render('admin/student/register' , { showFooter: false , students});
});

// Handle new student registration
router.post('/' , async (req, res) => {
  try {
    const studentData = req.body;

    // Create and save the new student
    const newStudent = new Student(studentData);
    await newStudent.save();

    // Redirect to students list after successful registration
    res.redirect('/admin/students');
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Show student profile (card)
router.get('/:id' , async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('admin/student/id', { showFooter: false, student });
});


// Show edit form
router.get('/:id/edit' , async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.render('admin/student/edit', { showFooter: false, student }); // adjust path if your edit form view is elsewhere
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Handle update
router.put('/:id', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body.student, { new: true, runValidators: true });
    res.redirect(`/admin/students/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Update failed');
  }
});

// Handle delete
router.delete('/:id',async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/admin/students');
  } catch (err) {
    res.status(500).send('Delete failed');
  }
});
module.exports = router;