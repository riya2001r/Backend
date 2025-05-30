// server.js
const express = require('express');
const bodyParser = require('body-parser');
const moodRoutes = require('./routes/moodRoutes');
const statsRoutes = require('./routes/statsRoutes');
const config = require('./config');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = config.server.port || 3000;

app.use('/api/moods', moodRoutes);
app.use('/api/stats', statsRoutes);

// Call syncData to start syncing TODO
// initMoodListener();

let server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
