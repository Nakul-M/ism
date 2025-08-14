const express = require('express');
const router = express.Router();
const ClassMonthlyFee = require('../../models/ClassMonthlyFee');

// GET form to enter/edit monthly fees
router.get('/edit', (req, res) => {
    res.render('admin/feeSetting/fee'); // Renders EJS form
});

// POST form to save monthly fees
router.post('/edit', async (req, res) => {
    try {
        const { selectedClass, ...monthlyFees } = req.body;

        // Convert string values to numbers
        for (let month in monthlyFees) {
            monthlyFees[month] = Number(monthlyFees[month]) || 0;
        }

        // Create or update fees for that class
        await ClassMonthlyFee.findOneAndUpdate(
            { class: selectedClass },
            { class: selectedClass, monthlyFees },
            { upsert: true, new: true, runValidators: true }
        );
        req.flash('success' ,'Fees Updated') ;
        res.redirect('/admin/class-fees/edit');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving fees.');
    }
});

module.exports = router;
