const express = require('express');
const cookieParser = require('cookie-parser'); // <-- הוספנו

const userRoutes = require('./routes/userRoutes');
const financialRoutes = require('./routes/financialRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser()); // <-- הוספנו

// הגדרת CORS (בשלב הבא נרחיב)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // או כתובת ה־frontend שלך
  credentials: true // מאפשר לשלוח cookies
}));

app.use('/users', userRoutes);
app.use('/financial', financialRoutes);

module.exports = app;
