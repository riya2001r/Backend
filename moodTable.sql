CREATE TABLE moods
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   VARCHAR(100) NOT NULL,
    mood      VARCHAR(20)  NOT NULL,
    note      TEXT,
    timestamp DATE         NOT NULL,

    CONSTRAINT uq_user_date UNIQUE (user_id, timestamp),
    CONSTRAINT uq_user_mood_date UNIQUE (user_id, mood, timestamp)
);
