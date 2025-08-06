const express = require('express');
const router = express.Router();
const Teacher = require('../../models/teacher'); // Adjust the path as necessary
const isAdminLoggedin = require('../../middlewares/isAdminLoggedin'); // Adjust the path as necessary
router.use(isAdminLoggedin);

// Ensure admin is logged in for all routes in this file
router.get('/' , async (req, res) => {
  const { name, employeeId } = req.query;
  const query = {};

  if (name) query.name = { $regex: `^${name}`, $options: 'i' };
  if (employeeId) query.employeeId = parseInt(employeeId);

  try {
    const teachers = await Teacher.find(query);
    res.render('admin/teacher/home', { showFooter: false, teachers, query });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).send("Server Error");
  }
});

router.get('/new' ,async(req, res) => {
  const teachers = await Teacher.find({});
  res.render('admin/teacher/register' , { showFooter: false , teachers});
});

router.post('/' , async (req, res) => {
  try {
    const teacherData = req.body;

    // Create and save the new student
    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

    // Redirect to students list after successful registration
    res.redirect('/admin/teachers');
  } catch (err) {
    console.error('Error registering teacher:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Show teacher profile (card)
router.get('/:id' , async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.render('admin/teacher/id', { showFooter: false, teacher });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Show edit form
router.get('/:id/edit' , async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.render('admin/teacher/edit', { showFooter: false, teacher });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Handle update
router.put('/:id' , async (req, res) => {
  try {
    await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body.teacher,
      { new: true, runValidators: true }
    );
    res.redirect(`/admin/teachers/${req.params.id}`);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).send('Update failed');
  }
});

// Handle delete
router.delete('/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.redirect('/admin/teachers');
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).send('Delete failed');
  }
});

module.exports = router ;