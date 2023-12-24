// validation.js
const validateTask = (req, res, next) => {
    const { title, description, priority, dueDate, userId } = req.body;
  
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
  
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ error: 'userId is required and must be a non-empty string' });
    }
  
    // Additional validation for other fields, if needed...
  
    next();
  };
  
  module.exports = validateTask;
  