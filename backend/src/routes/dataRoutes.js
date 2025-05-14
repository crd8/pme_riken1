// backend/src/routes/dataRoutes.js
const express = require('express');
const { Op } = require('sequelize');
const DataRealtime = require('../models/DataRealtime');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sinceMs = parseInt(req.query.since) || 0;
    const sinceDate = new Date(sinceMs);

    // Ambil 25 data terbaru sejak `sinceDate`, terurut terbaru ke terlama
    const rowsDesc = await DataRealtime.findAll({
      where: { time: { [Op.gt]: sinceDate } },
      order: [['time', 'DESC']],
      limit: 25
    });

    // Urutkan kembali ascending (terlama ke terbaru)
    const rows = rowsDesc.reverse();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
