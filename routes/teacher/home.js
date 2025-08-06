const express= require("express" );
const router = express.Router();
const Teacher = require('../../models/teacher');
const Student = require('../../models/student');
router.put('/dashboard', async (req, res) => {
  try {
    const { id, dob } = req.body;

    const teacher = await Teacher.findOne({
      employeeId: id,
      dateOfBirth: dob,
    });

    if (!teacher) {
      req.flash('error', 'Invalid Employee ID or Date of Birth');
      return res.redirect('/login/teacher');
    }

    // Redirect to the dashboard with teacher ID
    res.redirect(`/teacher/${teacher._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    res.render('teacher/dashboard', { showFooter: false, teacher });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get('/:id/students', async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Get the class for which they are class teacher
    const teacherClass = teacher.classTeacher;
    const teacherSec = teacher.section ;

    if (teacherClass == "*") {
      return res.status(400).json({ message: 'Teacher is not assigned as class teacher to any class' });
    }

    // Find students of that class
    const students = await Student.find({ class: teacherClass , section :teacherSec});

   res.render('teacher/student' ,{ showFooter: false, teacher , students}) ;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/marks-entry', async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }

    // Ensure teacher is assigned to a class
    const teacherClass = teacher.classTeacher;
    const teacherSection = teacher.section;

    if (teacherClass === "*" || !teacherClass || !teacherSection) {
      return res.status(400).send('Teacher is not assigned as class teacher to any class/section.');
    }

    // Find students of that class and section
    const students = await Student.find({
      class: teacherClass,
      section: teacherSection
    }).sort({ rollNo: 1 });

    // Render marks entry form
    res.render('teacher/marks-entry', {
      teacher,
      students,
      showFooter: false
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.put('/:id/marks-entry', async (req, res) => {
  try {
    const { examType, marks } = req.body;

    if (!examType) {
      req.flash('error', 'Please select an exam type.');
      return res.redirect(`/teacher/${req.params.id}/marks-entry`);
    }

    if (!marks || !Array.isArray(marks)) {
      req.flash('error', 'Invalid marks data.');
      return res.redirect(`/teacher/${req.params.id}/marks-entry`);
    }

    for (let entry of marks) {
      const { studentId, math, science, english, hindi, social } = entry;

      const updatePath = `marks.${examType}`;

      await Student.findByIdAndUpdate(studentId, {
        [updatePath]: {
          math: Number(math),
          science: Number(science),
          english: Number(english),
          hindi: Number(hindi),
          social: Number(social),
        },
      });
    }

    req.flash('success', 'Marks entered successfully.');
    res.redirect(`/teacher/${req.params.id}/students`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while entering marks.');
    res.redirect(`/teacher/${req.params.id}/marks-entry`);
  }
});


module.exports = router ;