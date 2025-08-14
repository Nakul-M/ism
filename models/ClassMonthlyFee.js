const mongoose = require('mongoose');

const classMonthlyFeeSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    unique: true
  },
  monthlyFees: {
    April: { type: Number, required: true, min: 0 },
    May: { type: Number, required: true, min: 0 },
    June: { type: Number, required: true, min: 0 },
    July: { type: Number, required: true, min: 0 },
    August: { type: Number, required: true, min: 0 },
    September: { type: Number, required: true, min: 0 },
    October: { type: Number, required: true, min: 0 },
    November: { type: Number, required: true, min: 0 },
    December: { type: Number, required: true, min: 0 },
    January: { type: Number, required: true, min: 0 },
    February: { type: Number, required: true, min: 0 },
    March: { type: Number, required: true, min: 0 }
  }
});

const ClassMonthlyFee = mongoose.model('ClassMonthlyFee', classMonthlyFeeSchema);
module.exports = ClassMonthlyFee;