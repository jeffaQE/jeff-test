const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority INTEGER DEFAULT 3,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialItems = [
  { name: 'Complete project documentation', description: 'Write comprehensive docs', due_date: '2025-12-10', priority: 1 },
  { name: 'Review pull requests', description: 'Review team PRs', due_date: '2025-12-05', priority: 2 },
  { name: 'Update dependencies', description: 'Update npm packages', due_date: null, priority: 3 }
];

const insertStmt = db.prepare(
  'INSERT INTO items (name, description, due_date, priority) VALUES (?, ?, ?, ?)'
);

initialItems.forEach(item => {
  insertStmt.run(item.name, item.description, item.due_date, item.priority);
});

console.log('In-memory database initialized with sample data');

// API Routes
app.get('/api/items', (req, res) => {
  try {
    const { sort = 'created_at', order = 'DESC' } = req.query;
    const validSorts = ['created_at', 'due_date', 'priority', 'name'];
    const validOrders = ['ASC', 'DESC'];
    
    const sortColumn = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    
    // Handle NULL values in sorting - put them last
    const orderByClause = sortColumn === 'due_date' 
      ? `CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ${sortOrder}`
      : `${sortColumn} ${sortOrder}`;
    
    const items = db.prepare(`SELECT * FROM items ORDER BY ${orderByClause}`).all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name, description, due_date, priority } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const validPriority = priority && !isNaN(priority) ? parseInt(priority) : 3;
    
    const stmt = db.prepare(
      'INSERT INTO items (name, description, due_date, priority) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, description || null, due_date || null, validPriority);
    const id = result.lastInsertRowid;

    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, due_date, priority } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const validPriority = priority && !isNaN(priority) ? parseInt(priority) : existingItem.priority;

    const stmt = db.prepare(
      'UPDATE items SET name = ?, description = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(name, description || null, due_date || null, validPriority, id);

    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.patch('/api/items/:id/complete', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newCompletedStatus = existingItem.completed ? 0 : 1;
    const stmt = db.prepare(
      'UPDATE items SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(newCompletedStatus, id);

    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error toggling completion:', error);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
});

module.exports = { app, db };