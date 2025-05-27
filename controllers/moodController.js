// controllers/moodController.js

const mysqlDb = require('../db/db');

// Define the supported moods
const supportedMoods = ['surprise', 'sad', 'neutral', 'happy', 'fear', 'disgust', 'angry'];

exports.addMood = async (req, res) => {
    let {userId, mood, note, timestamp} = req.body;
    if (!timestamp) {
        timestamp = new Date()
    }
    if (!userId || !mood) {
        return res.status(400).send({'message': 'Bad Request. Mood and UserId is required'})
    }

    mood = mood.toLowerCase();

    // Check if the mood is supported
    if (!supportedMoods.includes(mood.toLowerCase())) {
        return res.status(400).json({
            error: 'Invalid mood',
            message: `Mood must be one of: ${supportedMoods.join(', ')}`
        });
    }

    try {
        await mysqlDb.execute('INSERT INTO moods (user_id, mood, note, timestamp) VALUES (?, ?, ?, ?)', [userId, mood, note, timestamp]);
        res.status(201).json({message: 'Mood added!'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to add mood.', message: err?.message});
    }
};

exports.updateMoodNote = async (req, res) => {
    const {id} = req.params;
    const {note} = req.body;

    if (!note) {
        return res.status(400).json({error: 'Note is required.'});
    }

    try {
        const [result] = await mysqlDb.execute('UPDATE moods SET note = ? WHERE id = ?', [note, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Mood record not found.'});
        }

        res.status(200).json({message: 'Note updated successfully!'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to update note.', message: err?.message});
    }
};


exports.getMoods = async (req, res) => {
    const {userId} = req.params;

    try {
        const [rows] = await mysqlDb.execute('SELECT *, DATE(timestamp) as date FROM moods WHERE user_id = ?', [userId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error retrieving moods');
    }
};

exports.getMoodsByFilter = async (req, res) => {
    const {userId, startDate, endDate} = req.query;

    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({error: 'userId is required.'});
    }

    // Check if startDate is provided
    if (!startDate) {
        return res.status(400).json({error: 'startDate is required.'});
    }

    // Use current date as endDate if not provided
    const currentDate = new Date();
    const endDateToUse = endDate || currentDate;

    try {
        const [rows] = await mysqlDb.query(`SELECT *,
                                                   DATE_FORMAT(timestamp, '%Y-%m-%d') as date
                                            FROM moods
                                            WHERE user_id = ?
                                              AND DATE(timestamp) BETWEEN ? AND ?
                                            ORDER BY timestamp DESC
        `, [userId, startDate, endDateToUse]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Could not filter moods.', message: err?.message});
    }
};