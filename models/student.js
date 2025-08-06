const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true,
    maxlength: 10
  },
  dateOfBirth: {
    type: String
  },
  address: {
    type: String
  },
  parentContact: {
    type: String,
    maxlength: 10
  },
  parentName: {
    type: String
  },
  photo: {
    type: String,
    default: 'https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // ✅ Marks Schema
  marks: {
    U1: {
      math: Number,
      science: Number,
      english: Number,
      hindi: Number,
      social: Number
    },
    U2: {
      math: Number,
      science: Number,
      english: Number,
      hindi: Number,
      social: Number
    },
    U3: {
      math: Number,
      science: Number,
      english: Number,
      hindi: Number,
      social: Number
    },
    T1: {
      math: Number,
      science: Number,
      english: Number,
      hindi: Number,
      social: Number
    },
    T2: {
      math: Number,
      science: Number,
      english: Number,
      hindi: Number,
      social: Number
    }
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
