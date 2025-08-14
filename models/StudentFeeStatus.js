// models/StudentFeeStatus.js
const mongoose = require('mongoose');

const feeStatusSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  fees: {
    April:   { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    May:     { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    June:    { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    July:    { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    August:  { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    September:{ type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    October: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    November:{ type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    December:{ type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    January: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    February:{ type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    March:   { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }
  }
});

module.exports = mongoose.model('StudentFeeStatus', feeStatusSchema);
