require('dotenv').config();
const express = require('express');
const path = require('path');
const smsRoutes = require('./routes/smsRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/sms', smsRoutes);
app.use('/api/customers', customerRoutes);

// Dashboard redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard/customers.html');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
