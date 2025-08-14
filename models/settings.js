const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    resultVisible: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
