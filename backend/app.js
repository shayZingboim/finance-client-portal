const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`the server run with port: ${PORT}`);
});

module.exports = app;

