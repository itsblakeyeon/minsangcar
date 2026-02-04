const db = require('../config/database');

const SmsLog = {
  async create(to, message, status) {
    const query = `
      INSERT INTO sms_logs (recipient, message, status, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const result = await db.query(query, [to, message, status]);
    return result.rows[0];
  },

  async findAll(limit = 100) {
    const query = 'SELECT * FROM sms_logs ORDER BY created_at DESC LIMIT $1';
    const result = await db.query(query, [limit]);
    return result.rows;
  },
};

const Customer = {
  async create(name, phone, status = 'new', notes = null) {
    const query = `
      INSERT INTO customers (name, phone, status, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [name, phone, status, notes]);
    return result.rows[0];
  },

  async findAll(limit = 100) {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1';
    const result = await db.query(query, [limit]);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findByPhone(phone) {
    const query = 'SELECT * FROM customers WHERE phone = $1';
    const result = await db.query(query, [phone]);
    return result.rows[0];
  },

  async update(id, { name, phone, status, notes }) {
    const query = `
      UPDATE customers
      SET name = COALESCE($2, name),
          phone = COALESCE($3, phone),
          status = COALESCE($4, status),
          notes = COALESCE($5, notes)
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id, name, phone, status, notes]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findByStatus(status) {
    const query = 'SELECT * FROM customers WHERE status = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [status]);
    return result.rows;
  },
};

const Conversation = {
  async create(customerId, message, sender) {
    const query = `
      INSERT INTO conversations (customer_id, message, sender)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [customerId, message, sender]);
    return result.rows[0];
  },

  async findByCustomerId(customerId, limit = 20) {
    const query = `
      SELECT * FROM conversations
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await db.query(query, [customerId, limit]);
    return result.rows.reverse(); // 시간순 정렬
  },

  async getRecentHistory(customerId, limit = 10) {
    const conversations = await this.findByCustomerId(customerId, limit);
    return conversations.map(c => ({
      role: c.sender === 'customer' ? 'user' : 'assistant',
      content: c.message
    }));
  },
};

module.exports = { SmsLog, Customer, Conversation };
