const express = require('express');
const router = express.Router();
const websocketService = require('../services/wsSrv');
const pool = require('../config/db'); // Adjust the path as necessary

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
  console.log('Received request to scrape battle:', req.body);

  if (!battleId || isNaN(battleId)) {
    console.error('Invalid battle ID');
    return res
      .status(400)
      .json({ success: false, message: 'Invalid battle ID' });
  }

  const url = `https://eclesiar.com/war/${battleId}`;
  console.log(`Attempting to open URL: ${url}`);

  try {
    // Import 'open' dynamically
    const { default: open } = await import('open');
    console.log('Imported open module successfully.');

    // Open the URL in Edge
    try {
      await open(url, { app: { name: 'msedge' } });
      console.log(`Opened Edge with URL: ${url}`);
    } catch (err) {
      console.error('Error opening Edge:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to open Edge' });
    }

    // return res.status(200).json({
    //   success: true,
    //   message: `Scraping triggered for battle ID: ${battleId}`,
    // });
  } catch (error) {
    console.error('Error in scrapeBattle route:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to open Edge' });
  }
});

router.post('/saveBattleData', async (req, res) => {
  const battleData = req.body;

  if (!battleData) {
    return res
      .status(400)
      .json({ success: false, message: 'No data received' });
  }

  // Map data to database fields
  const round_id = totalRounds;
  const status = isBattleOver ? 'over' : 'ongoing';

  const { isBattleOver, totalRounds, url } = battleData;

  try {
    // Insert into the database
    const insertQuery = `
      INSERT INTO battles (round_id, status)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const values = [round_id, status];

    const result = await pool.query(insertQuery, values);

    const insertedId = result.rows[0].id;
    console.log(`Inserted battle with ID: ${insertedId}`);

    return res.status(200).json({
      success: true,
      message: 'Battle data saved successfully',
      battleId: insertedId,
    });
  } catch (error) {
    console.error('Error saving battle data:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to save battle data' });
  }
});

module.exports = router;
