// task.js
// task.js
// task.js
const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(title, description, priority, dueDate, userId) {
    this.id = uuidv4(); // Use uuidv4() to generate a unique ID
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.userId = userId;
    this.completed = false; // Default to false when a new task is created
  }
}

module.exports = Task;
