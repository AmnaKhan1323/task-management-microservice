// tests/task.test.js
// tests/task.test.js

const Task = require('../task');

test('Create Task should initialize with correct properties', () => {
  // Arrange
  const task = new Task('Test Task', 'Description', 'High', '2023-01-01', 'user123');

  // Assert
  expect(task.title).toBe('Test Task');       // Check if title is set correctly
  expect(task.description).toBe('Description');  // Check if description is set correctly
  expect(task.priority).toBe('High');         // Check if priority is set correctly
  expect(task.dueDate).toBe('2023-01-01');    // Check if dueDate is set correctly
  expect(task.userId).toBe('user123');        // Check if userId is set correctly
  expect(task.completed).toBe(false);          // Check if completed is set to false by default
});
