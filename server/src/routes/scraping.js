const express = require('express');
const router = express.Router();
const websocketService = require('../services/websocketService');

router.post('/triggerScraping', (req, res) => {
  const { action, type, startId } = req.body;
  const result = websocketService.triggerScraping(action, type, startId);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(503).json(result);
  }
});

module.exports = router;
