const db = require('./db');

async function isBattleDataAvailable(battleId) {
  const urlPattern = `%/war/${battleId}%`;
  const result = await db.query('SELECT id FROM battles WHERE url LIKE $1', [
    urlPattern,
  ]);
  return result.rows.length > 0;
}

async function isDailyDamageAvailable(day, country = null) {
  let query = `
    SELECT id FROM daily_damage 
    WHERE day = COALESCE($1, (SELECT MAX(day) FROM daily_damage))
  `;
  let values = [day];

  if (country) {
    query += ' AND country_name = $2';
    values.push(country);
  }

  const result = await db.query(query, values);
  return result.rows.length > 0;
}

async function waitForScrapingToComplete(
  battleId,
  timeout = 60000,
  interval = 5000
) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkData = async () => {
      try {
        const dataAvailable = await isBattleDataAvailable(battleId);

        if (dataAvailable) {
          resolve();
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for scraping to complete.'));
        } else {
          setTimeout(checkData, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    checkData();
  });
}

async function waitForDailyDamageScrapingToComplete(
  day,
  country = null,
  timeout = 60000,
  interval = 5000
) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkData = async () => {
      try {
        const dataAvailable = await isDailyDamageAvailable(day, country);

        if (dataAvailable) {
          resolve();
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for scraping to complete.'));
        } else {
          setTimeout(checkData, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    checkData();
  });
}

module.exports = {
  waitForScrapingToComplete,
  isBattleDataAvailable,
  waitForDailyDamageScrapingToComplete,
  isDailyDamageAvailable,
};
