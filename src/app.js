const express = require('express');
const database = require('./utils/db');
const bookRoutes = require('./routes/bookRoutes');

require('dotenv').config();

database.connectDb();

const app = express();
app.use(express.json());

app.use('/api', bookRoutes);

module.exports = app;
