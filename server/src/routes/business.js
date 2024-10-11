const express = require('express');
const router = express.Router();
const businessService = require('../services/businessSrv');

router.post('/saveBusinessData', async (req, res, next) => {
  try {
    const data = req.body;
    await businessService.saveBusinessData(data);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
