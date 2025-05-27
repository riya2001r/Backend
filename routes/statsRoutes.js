// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/user/:userId', statsController.getMoodStats);
router.get('/trends/:userId', statsController.getTrends);
router.get('/weekly', statsController.getWeeklyStats);
router.get('/monthly', statsController.getMonthlyStats);

module.exports = router;
