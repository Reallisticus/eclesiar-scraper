const db = require('./db');

async function isBattleDataAvailable(battleId) {
  const urlPattern = `%/war/${battleId}%`;
  const result = await db.query('SELECT id FROM battles WHERE url LIKE $1', [
    urlPattern,
  ]);
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

module.exports = {
  waitForScrapingToComplete,
  isBattleDataAvailable,
};
