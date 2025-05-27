// controllers/statsController.js
const mysqlDb = require('../db/db');

exports.getTrends = async (req, res) => {
    try {
        const [rows] = await mysqlDb.query(`
            SELECT mood,
                   COUNT(*)        as count,
                   DATE(timestamp) as day
            FROM moods
            GROUP BY mood, day
            ORDER BY day DESC
            LIMIT 30
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({error: 'Could not fetch trends'});
    }
};

exports.getMoodStats = async (req, res) => {
    try {
        const [rows] = await mysqlDb.query(`
            SELECT mood,
                   COUNT(*) as count
            FROM moods
            GROUP BY mood
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({error: 'Could not fetch stats'});
    }
};

exports.getWeeklyStats = async (req, res) => {
    const {userId} = req.query;

    try {
        const [rows] = await mysqlDb.query(`
            SELECT WEEK(timestamp) AS week,
                   YEAR(timestamp) AS year,
                   mood,
                   COUNT(*)        as count
            FROM moods
            WHERE user_id = ?
            GROUP BY year, week, mood
            ORDER BY year DESC, week DESC
        `, [userId]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Could not fetch weekly stats.'});
    }
};

exports.getMonthlyStats = async (req, res) => {
    const {userId} = req.query;

    try {
        const [rows] = await mysqlDb.query(`
            SELECT MONTH(timestamp) AS month,
                   YEAR(timestamp)  AS year,
                   mood,
                   COUNT(*)         as count
            FROM moods
            WHERE user_id = ?
            GROUP BY year, month, mood
            ORDER BY year DESC, month DESC
        `, [userId]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Could not fetch monthly stats.'});
    }
};


