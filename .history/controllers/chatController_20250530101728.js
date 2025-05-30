const db = require('../db/db');

exports.saveChatMessage = async (req, res) => {
  const { user_id, sender, message, timestamp } = req.body;

  try {
    await db.execute(
      'INSERT INTO chat_logs (user_id, sender, message, timestamp) VALUES (?, ?, ?, ?)',
      [user_id, sender, message, timestamp]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
