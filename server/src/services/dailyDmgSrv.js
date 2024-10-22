// src/services/dailyDamageSrv.js
const DailyDamageModel = require('../models/dailyDamageModel');
const openUrlAndTriggerScraper = require('../utils/openURL');
const url = 'https://eclesiar.com/statistics/country/damage';

async function fetchAndSaveDailyDamage(day = null, country = null) {
  try {
    // Ensure the daily_damage table exists
    await DailyDamageModel.createTable();
    console.log(`Day: ${day}, Country: ${country}`);
    let existingData;

    if (country && day) {
      existingData = await DailyDamageModel.getDailyDamageByDayAndCountry(
        day,
        country
      );

      console.log(existingData);

      if (existingData.length > 0) {
        const nextDayResult = await DailyDamageModel.getNextDayForCountry(
          day,
          country
        );

        // Calculate the daily damage
        if (nextDayResult) {
          console.log('Next day data:', nextDayResult);

          const currentDamage = existingData[0].damage;
          const nextDayDamage = nextDayResult.damage;
          const dailyDamage = nextDayDamage - currentDamage;

          // Return the result with the calculated daily damage
          return {
            success: true,
            day,
            country,
            total_damage: currentDamage,
            next_day_total_damage: nextDayDamage,
            daily_damage: dailyDamage,
          };
        }
      } else if (existingData.length === 0) {
        // If no data exists for the specified day
        console.log(`No data found for ${country} on Day ${day}.`);
        return {
          success: false,
          message: `No data found for ${country} on Day ${day}.`,
        };
      }
    }

    console.log('Proceeding to scrape daily damage data.');
    const url = 'https://eclesiar.com/statistics/country/damage';
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
