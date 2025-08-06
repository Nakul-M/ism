const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
    employeeId: {
    type: String,
    required: true,
    unique: true,
    },
    dateOfBirth: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  contact: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
address : {
    type: String,
    required: true
  },
  image : { 
    type: String,
    default: 'https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP'
  },
  classTeacher: {
    type: String,
    required: false,
    default: '*',
  },
  section: {
    type: String,
    required: false,
    default : '*',
  }
})


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
