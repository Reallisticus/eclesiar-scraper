// src/services/dailyDamageSrv.js
const DailyDamageModel = require('../models/dailyDamageModel');
const { openUrlAndTriggerScraper } = require('../utils/scraper');

async function fetchAndSaveDailyDamage() {
  try {
    // Ensure the daily_damage table exists
    await DailyDamageModel.createTable();

    const url = 'https://eclesiar.com/statistics/country/damage';

    // Check if we already have data for today
    const today = new Date().toISOString().split('T')[0];
    const existingData = await DailyDamageModel.getDailyDamageByDate(today);

    if (existingData.length > 0) {
      console.log(
        'Daily damage data already exists for today. No need to scrape.'
      );
      return {
        success: true,
        message: 'Data already exists',
        needsScraping: false,
      };
    }

    // If no data exists for today, trigger the scraper
    console.log('Proceeding to scrape daily damage data.');
    await openUrlAndTriggerScraper(url);

    return {
      success: true,
      message: 'Scraping triggered for daily damage',
      needsScraping: true,
    };
  } catch (error) {
    console.error('Error fetching and saving daily damage data:', error);
    throw error;
  }
}

async function saveDailyDamage(damageData) {
  try {
    const { day, countries } = damageData;

    for (const country of countries) {
      await DailyDamageModel.insertDailyDamage({
        date: new Date().toISOString().split('T')[0], // Use today's date
        day,
        countryName: country.country,
        damage: country.damage,
      });
    }

    console.log(`Daily damage data saved successfully for ${day}`);
    return true;
  } catch (error) {
    console.error('Error saving daily damage data:', error);
    throw error;
  }
}

module.exports = {
  fetchAndSaveDailyDamage,
  saveDailyDamage,
};
