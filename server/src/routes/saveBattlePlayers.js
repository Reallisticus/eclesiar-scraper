const express = require('express');
const router = express.Router();
const { saveBattlePlayers } = require('../services/battlePlayersSrv');

router.post('/saveBattlePlayers', async (req, res) => {
  const { players, battleId } = req.body;

  console.log(req.body);

  if (!players || !battleId) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  try {
    // Save the scraped battle players data
    await saveBattlePlayers(players, battleId);

    return res.status(200).json({
      success: true,
      message: 'Battle players data saved successfully',
    });
  } catch (error) {
    console.error('Error saving battle players data:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to save battle players data' });
  }
});

module.exports = router;
