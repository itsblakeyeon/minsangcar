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

// IP 확인 엔드포인트
app.get('/api/my-ip', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get('https://api.ipify.org?format=json');
    res.json({
      railwayIP: response.data.ip,
      requestIP: req.ip,
      forwardedFor: req.headers['x-forwarded-for'] || 'none',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      requestIP: req.ip,
      forwardedFor: req.headers['x-forwarded-for'] || 'none'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
