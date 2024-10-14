const express = require('express');
const cors = require('cors');
const businessRoutes = require('./routes/business');
const regionRoutes = require('./routes/region');
const scrapingRoutes = require('./routes/scraping');
const errorHandler = require('./middleware/errorHandler');
const countryRoute = require('./routes/country'); // Don't forget to add this import
const saveBattleData = require('./routes/saveBattleData');
const battlePlayerRoute = require('./routes/saveBattlePlayers');

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
app.use('/api', countryRoute);
app.use('/api', saveBattleData);
app.use('/api', battlePlayerRoute);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use(errorHandler);

module.exports = app;
