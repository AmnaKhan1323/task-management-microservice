// db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Use __dirname to get the current directory and construct the database file path
const dbPath = path.join(__dirname, 'tasks.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      priority TEXT,
      dueDate TEXT,
      userId TEXT,
      completed INTEGER
    )
  `, (error) => {
    if (error) {
      console.error('Error creating tasks table:', error.message);
    } else {
      console.log('Tasks table created successfully.');
    }
  });
});

module.exports = db;
