const express = require('express');
const router = express.Router();
const websocketService = require('../services/wsSrv');
const pool = require('../config/db'); // Adjust the path as necessary
const BattleModel = require('../models/battleModel');

router.post('/triggerScraping', (req, res) => {
  const { action, type, startId } = req.body;
  const result = websocketService.triggerScraping(action, type, startId);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(503).json(result);
  }
});

router.post('/scrapeBattle', async (req, res) => {
  const { battleId } = req.body;

  if (!battleId || isNaN(battleId)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid battle ID' });
  }

  const url = `https://eclesiar.com/war/${battleId}`;

  try {
    const existingBattle = await BattleModel.getBattleByUrl(url);

    if (existingBattle) {
      if (existingBattle.status === 'over') {
        console.log(
          'Battle is over and data exists in the database. No need to scrape.'
        );
        return res.status(200).json({
          success: true,
          message: 'Battle data already exists and battle is over',
          needsScraping: false, // Indicate that scraping is not needed
        });
      } else {
        console.log('Battle is ongoing. Proceeding to scrape and update data.');
        await openUrlAndTriggerScraper(url);

        return res.status(200).json({
          success: true,
          message: `Scraping triggered for battle ID: ${battleId}`,
          needsScraping: true,
        });
      }
    } else {
      console.log(
        'Battle does not exist in the database. Proceeding to scrape and insert data.'
      );
      await openUrlAndTriggerScraper(url);

      return res.status(200).json({
        success: true,
        message: `Scraping triggered for battle ID: ${battleId}`,
        needsScraping: true,
      });
    }
  } catch (error) {
    console.error('Error in scrapeBattle route:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to open Edge' });
  }
});

async function openUrlAndTriggerScraper(url) {
  // Import 'open' dynamically
  const { default: open } = await import('open');
  console.log('Imported open module successfully.');

  // Open the URL in Edge
  try {
    await open(url, { app: { name: 'msedge' } });
    console.log(`Opened Edge with URL: ${url}`);
  } catch (err) {
    console.error('Error opening Edge:', err);
    throw new Error('Failed to open Edge');
  }
}

module.exports = router;
