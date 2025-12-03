const request = require('supertest');
const { app, db } = require('../src/app');

describe('Todo API', () => {
  beforeEach(() => {
    // Clear the database before each test
    db.prepare('DELETE FROM items').run();
  });

  afterAll(() => {
    db.close();
  });

  describe('GET /api/items', () => {
    it('should return an empty array when no items exist', async () => {
      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all items', async () => {
      const stmt = db.prepare(
        'INSERT INTO items (name, description, due_date, priority) VALUES (?, ?, ?, ?)'
      );
      stmt.run('Test Task', 'Test Description', '2025-12-10', 1);

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Task');
    });

    it('should sort items by due_date', async () => {
      const stmt = db.prepare(
        'INSERT INTO items (name, due_date, priority) VALUES (?, ?, ?)'
      );
      stmt.run('Task 1', '2025-12-15', 3);
      stmt.run('Task 2', '2025-12-10', 3);

      const response = await request(app).get('/api/items?sort=due_date&order=ASC');
      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('Task 2');
      expect(response.body[1].name).toBe('Task 1');
    });

    it('should sort items by priority', async () => {
      const stmt = db.prepare(
        'INSERT INTO items (name, priority) VALUES (?, ?)'
      );
      stmt.run('Low Priority', 5);
      stmt.run('High Priority', 1);

      const response = await request(app).get('/api/items?sort=priority&order=ASC');
      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe('High Priority');
      expect(response.body[1].name).toBe('Low Priority');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with all fields', async () => {
      const newItem = {
        name: 'New Task',
        description: 'Task description',
        due_date: '2025-12-20',
        priority: 2,
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe(newItem.description);
      expect(response.body.due_date).toBe(newItem.due_date);
      expect(response.body.priority).toBe(newItem.priority);
    });

    it('should create a new item with only required fields', async () => {
      const newItem = { name: 'Minimal Task' };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.priority).toBe(3);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty string', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '   ' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const stmt = db.prepare(
        'INSERT INTO items (name, priority) VALUES (?, ?)'
      );
      const result = stmt.run('Original Task', 3);
      const itemId = result.lastInsertRowid;

      const updatedData = {
        name: 'Updated Task',
        description: 'Updated description',
        due_date: '2025-12-25',
        priority: 1,
      };

      const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.description).toBe(updatedData.description);
      expect(response.body.priority).toBe(updatedData.priority);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/items/9999')
        .send({ name: 'Updated Task' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 400 if name is missing', async () => {
      const stmt = db.prepare('INSERT INTO items (name) VALUES (?)');
      const result = stmt.run('Task');
      const itemId = result.lastInsertRowid;

      const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send({ description: 'Only description' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/items/:id/complete', () => {
    it('should toggle task completion status', async () => {
      const stmt = db.prepare('INSERT INTO items (name, completed) VALUES (?, ?)');
      const result = stmt.run('Task', 0);
      const itemId = result.lastInsertRowid;

      const response = await request(app).patch(`/api/items/${itemId}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);

      const response2 = await request(app).patch(`/api/items/${itemId}/complete`);
      expect(response2.body.completed).toBe(0);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).patch('/api/items/9999/complete');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const stmt = db.prepare('INSERT INTO items (name) VALUES (?)');
      const result = stmt.run('Task to delete');
      const itemId = result.lastInsertRowid;

      const response = await request(app).delete(`/api/items/${itemId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item deleted successfully');

      const checkItem = db.prepare('SELECT * FROM items WHERE id = ?').get(itemId);
      expect(checkItem).toBeUndefined();
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).delete('/api/items/9999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/items/invalid');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid item ID is required');
    });
  });
});
