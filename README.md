# MoodTracking Project

This is a Node.js project for mood tracking application.

## 📦 Features

- Express.js for server
- Structured for easy extension

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or above recommended)

### Installation

```bash
git clone https://github.com/riya2001r/MoodTracking.git
cd api-docs
cp .env.example .env
npm install
```

### Docker for MySQL
```
docker compose up -d (This will start mysql server. No need to install mysql.)
```

### Migration
```
Run moodTable.sql
```

### Running the app
```
npm start       # For production
npm run dev     # For development with nodemon
```

### Project Structure
```
your-node-project/
├── src/
│   └── server.js         # Entry point
├── package.json
├── .gitignore
└── README.md

```