require('dotenv').config();
const express = require('express');
const sequelize = require('./common/database');
const Client = require('./common/models/Client');
const app = express();

sequelize.sync();

app.use(express.json());

const authRoutes = require('./authorization/routes');
app.use('/', authRoutes);

const userRoutes = require('./users/routes');
app.use('/user', userRoutes);

app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, ( ) => console.log(`Server is running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong'
  });
});