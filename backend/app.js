const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const financialRoutes = require('./routes/financialRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS: רק למקורות שאנחנו באמת תומכים בהם
app.use(cors({
  origin: ['http://localhost:3000', 'http://13.50.125.245'],
  credentials: true
}));

// ✅ API routes
app.use('/users', userRoutes);
app.use('/financial', financialRoutes);

// ✅ Serve React static files
app.use(express.static(path.join(__dirname, '../client/build')));

// ✅ Fallback to index.html for React Router (SPA)
app.get(/^\/(?!users|financial).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;
