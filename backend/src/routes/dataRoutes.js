const express = require('express');
const { Op } = require('sequelize');
const DataRealtime = require('../models/DataRealtime');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sinceMs = parseInt(req.query.since) || 0;
    const sinceDate = new Date(sinceMs);

    const rowsDesc = await DataRealtime.findAll({
      where: { time: { [Op.gt]: sinceDate } },
      order: [['time', 'DESC']],
      limit: 50
    });

    const rows = rowsDesc.reverse();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
