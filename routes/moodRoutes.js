// routes/moodRoutes.js
const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.post('/', moodController.addMood);
router.get('/filter', moodController.getMoodsByFilter);
router.put('/:id', moodController.updateMoodNote);
router.get('/user/:userId', moodController.getMoods);
module.exports = router;
