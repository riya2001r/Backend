const initMoodListener = (firebaseDB, db) => {
    const moodsRef = firebaseDB.ref('moods');

    moodsRef.on('child_added', async (snapshot) => {
        const data = snapshot.val();
        console.log('🔄 New mood added in Firebase:', data);

        try {
            await db.execute(
                'INSERT INTO moods (user_id, mood, note, timestamp) VALUES (?, ?, ?, ?)',
                [data.user_id, data.mood, data.note || '', data.timestamp]
            );
        } catch (err) {
            console.error('❌ MySQL insert error:', err);
        }
    });
};

module.exports = {
    initMoodListener
};
