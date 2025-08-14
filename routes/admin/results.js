const express = require('express');
const Settings = require('../../models/settings');
const router = express.Router();

// GET page to control result visibility
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if they don't exist
            settings = new Settings();
            await settings.save();
        }
        res.render('admin/result/show', { settings , showFooter: false });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// POST to toggle result visibility
router.post('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        settings.resultVisible = !settings.resultVisible;
        await settings.save();
        req.flash("success" , "Changed Settings") ;
        res.redirect('/admin/results');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
