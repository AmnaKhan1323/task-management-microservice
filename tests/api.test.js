// tests/api.test.js
const request = require('supertest');
const app = require('../index');

test('Create Task', async () => {
  const response = await request(app)
    .post('/tasks')
    .send({
      title: 'Test Task',
      description: 'Description',
      priority: 'High',
      dueDate: '2023-01-01',
      userId: 'user123',
    });

  // Expecting a 201 Created status code
  expect(response.status).toBe(201);

  // Check the structure of the response body
  expect(response.body).toHaveProperty('id');
  expect(response.body.title).toBe('Test Task');
  expect(response.body.description).toBe('Description');
  expect(response.body.priority).toBe('High');
  expect(response.body.dueDate).toBe('2023-01-01');
  expect(response.body.userId).toBe('user123');
  expect(response.body.completed).toBe(false); // Assuming completed should be false for a new task
});
