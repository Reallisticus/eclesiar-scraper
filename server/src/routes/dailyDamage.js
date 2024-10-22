// src/routes/dailyDamage.js
const express = require('express');
const router = express.Router();
const {
  fetchAndSaveDailyDamage,
  saveDailyDamage,
} = require('../services/dailyDmgSrv');

router.post('/fetchDailyDamage', async (req, res) => {
  let { day, country } = req.body; // Extract day from request body
  const parsedDay = day ? `Day ${day}` : null;
  if (country) {
    country = country.trim().toLowerCase(); // Convert country to lowercase
  }
  try {
    const result = await fetchAndSaveDailyDamage(parsedDay, country).catch(
      (error) => {
        console.log(error);
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in fetchDailyDamage route:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily damage data',
    });
  }
});

router.post('/saveDailyDamage', async (req, res) => {
  try {
    const damageData = req.body;

    console.log('Received daily damage data:', damageData);

    if (!damageData || !damageData.day || !damageData.countries) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
      });
    }

    await saveDailyDamage(damageData);

    return res.status(200).json({
      success: true,
      message: 'Daily damage data saved successfully',
    });
  } catch (error) {
    console.error('Error in saveDailyDamage route:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save daily damage data',
    });
  }
});

module.exports = router;
