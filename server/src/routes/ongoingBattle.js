const express = require('express');
const router = express.Router();
const battleService = require('../services/battleSrv');

// Route to save ongoing battle data
router.post('/saveOngoingBattleData', async (req, res, next) => {
  try {
    const { round_id } = req.body; // Make sure the client sends `round_id`
    if (!round_id) {
      return res
        .status(400)
        .json({ success: false, message: 'round_id is required' });
    }

    const battleData = await battleService.saveOngoingBattleData({ round_id });
    res.status(200).json({ success: true, data: battleData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
