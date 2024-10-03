const express = require('express');
const cors = require('cors');
const businessRoutes = require('./routes/business');
const regionRoutes = require('./routes/region');
const scrapingRoutes = require('./routes/scraping');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.options('*', cors());
app.use(express.json());

app.use('/api', businessRoutes);
app.use('/api', regionRoutes);
app.use('/api', scrapingRoutes);

app.use(errorHandler);

module.exports = app;
