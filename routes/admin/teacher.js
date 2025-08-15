const express = require('express');
const router = express.Router();
const Teacher = require('../../models/teacher'); // Adjust the path as necessary
const isAdminLoggedin = require('../../middlewares/isAdminLoggedin');
const {upload , minFileSize} = require("../../middlewares/upload"); // Adjust the path as necessary
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

router.post('/', upload.single("image"),minFileSize , async (req, res) => {
  try {
    const teacherData = req.body;

    // If a file is uploaded, add the Cloudinary URL
    if (req.file) {
      teacherData.image = req.file.path; // Cloudinary public URL
    }

    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

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
router.put('/:id', upload.single("image"),minFileSize, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateData = req.body.teacher || {};

    // Find existing teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }

    // If new photo uploaded → use Cloudinary URL
    if (req.file) {
      updateData.image = req.file.path;
    } else {
      // Keep existing photo
      updateData.image = teacher.image;
    }

    // Update teacher
    await Teacher.findByIdAndUpdate(teacherId, updateData, {
      new: true,
      runValidators: true
    });

    res.redirect(`/admin/teachers/${teacherId}`);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).send("Update failed");
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