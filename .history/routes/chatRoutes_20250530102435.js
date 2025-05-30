// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db'); // or wherever your mysql connection is

router.post('/save', async (req, res) => {
  const { user_id, sender, message, timestamp } = req.body;

  try {
    await db.execute(
      'INSERT INTO chat_logs (user_id, sender, message, timestamp) VALUES (?, ?, ?, ?)',
      [user_id, sender, message, timestamp]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
