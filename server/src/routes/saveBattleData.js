const express = require('express');
const router = express.Router();
const BattleModel = require('../models/battleModel');

router.post('/saveBattleData', async (req, res) => {
  const { isBattleOver, totalRounds, url, attacker, defender, winner } =
    req.body;

  // Determine the status based on whether the battle is over
  const status = isBattleOver ? 'over' : 'ongoing';
  const round_id = totalRounds; // Map totalRounds to round_id

  console.log('Received data:', {
    isBattleOver,
    totalRounds,
    url,
    attacker,
    defender,
    winner,
  });
  console.log('Computed values:', { status, round_id });

  try {
    // Ensure the battles table exists
    await BattleModel.createTable();

    // Insert battle data into the database
    const insertedId = await BattleModel.insertBattle({
      round_id,
      status,
      url,
      attacker,
      defender,
      winner,
    });

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
