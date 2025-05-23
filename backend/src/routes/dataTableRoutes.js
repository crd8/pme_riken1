const express = require('express');
const { Op } = require('sequelize');
const DataRealtime = require('../models/DataRealtime');
const router = express.Router();

router.get('/', async (req, res) => {
  const dateStr = req.query.date;
  if (!dateStr) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  const start = new Date(`${dateStr}T00:00:00`);
  const end   = new Date(`${dateStr}T23:59:59`);

  try {
    const rows = await DataRealtime.findAll({
      where: { time: { [Op.between]: [start, end] } },
      order: [['time', 'ASC']]
    });
    res.json(rows);
  } catch (err) {
    console.error('Fetch data-table error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
