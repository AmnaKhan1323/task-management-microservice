// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Task = require('./task');
const db = require('./db');
const validateTask = require('./validation');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management System!');
});

// Admins create/edit tasks with validation
app.post('/tasks', validateTask, async (req, res) => {
  try {
    const { title, description, userId, priority, dueDate } = req.body;

    // Check for duplicate task by title and user
    const duplicateCheckResult = await db.query('SELECT * FROM tasks WHERE title = $1 AND userId = $2', [title, userId]);

    if (duplicateCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Task with the same title already exists for this user' });
    }

    // Continue with creating the task if no duplicate
    const task = new Task(title, description, priority, dueDate, userId);

    // Insert the task into the database
    const insertResult = await db.query(
      'INSERT INTO tasks (id, title, description, priority, dueDate, userId, completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [task.id, task.title, task.description, task.priority, task.dueDate, task.userId, task.completed]
    );

    res.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Admins search and sort tasks
app.get('/tasks', async (req, res) => {
  try {
    const { sortBy, searchBy, searchValue } = req.query;

    let query = 'SELECT * FROM tasks';

    // Implement sorting
    if (sortBy) {
      const allowedSortFields = ['title', 'priority', 'dueDate', 'completed'];
      if (allowedSortFields.includes(sortBy)) {
        query += ` ORDER BY ${sortBy}`;
      } else {
        return res.status(400).json({ error: 'Invalid sortBy parameter' });
      }
    }

    // Implement searching
    if (searchBy && searchValue) {
      const allowedSearchFields = ['title', 'description', 'userId'];
      if (allowedSearchFields.includes(searchBy)) {
        query += ` WHERE ${searchBy} ILIKE '%${searchValue}%'`;
      } else {
        return res.status(400).json({ error: 'Invalid searchBy parameter' });
      }
    }

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Users mark tasks as complete
app.patch('/tasks/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await db.query('UPDATE tasks SET completed = 1 WHERE id = $1 RETURNING *', [taskId]);

    const completedTask = result.rows[0];
    res.json({ success: true });

    // Raise an event (log for demonstration purposes)
    console.log(`Task marked as complete: ${JSON.stringify(completedTask)}`);

    // In a real-world scenario, you would integrate with a message broker to handle events asynchronously
    // Example with RabbitMQ: publishToMessageBroker('taskCompleted', taskId);
  } catch (error) {
    console.error('Error marking task as complete:', error.message);
    res.status(500).json({ error: 'Failed to mark task as complete' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
