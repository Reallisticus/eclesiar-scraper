// routes/countryRoute.js
const express = require('express');
const router = express.Router();
const countryService = require('../services/countrySrv');

router.post('/populateCountries', async (req, res, next) => {
  try {
    await countryService.populateCountries();
    res
      .status(200)
      .json({ success: true, message: 'Countries populated successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
