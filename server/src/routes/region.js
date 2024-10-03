const express = require('express');
const router = express.Router();
const regionService = require('../services/regionService');

router.post('/saveRegionData', async (req, res, next) => {
  try {
    const data = req.body;
    await regionService.saveRegionData(data);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
