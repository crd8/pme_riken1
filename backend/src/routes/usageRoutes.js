const express = require('express');
const { fn, col, literal, where } = require('sequelize');
const DataRealtime = require('../models/DataRealtime');
const router = express.Router();

router.get('/hourly', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

    const rows = await DataRealtime.findAll({
      attributes: [
        [fn('HOUR', col('time')), 'hour'],
        [literal(`
          MAX(
            CAST(
              REPLACE(kwh, ',', '')  -- hapus koma ribuan
              AS UNSIGNED
            )
          )
          -
          MIN(
            CAST(
              REPLACE(kwh, ',', '')  -- hapus koma ribuan
              AS UNSIGNED
            )
          )
        `), 'usage']
      ],
      where: where(fn('DATE', col('time')), date),
      group: [fn('HOUR', col('time'))],
      order: [[literal('hour'), 'ASC']],
      raw: true
    });

    res.json(
      rows.map(r => ({
        hour:  r.hour,
        usage: Number(r.usage)
      }))
    );
  } catch (err) {
    console.error('Error fetching hourly usage:', err);
    res.status(500).json({ error: 'Failed to fetch hourly usage' });
  }
});


router.get('/daily', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Missing month parameter' });

    const rows = await DataRealtime.findAll({
      attributes: [
        [fn('DATE', col('time')), 'date'],
        [literal(`
          MAX(
            CAST(
              REPLACE(kwh, ',', '')
              AS UNSIGNED
            )
          )
          -
          MIN(
            CAST(
              REPLACE(kwh, ',', '')
              AS UNSIGNED
            )
          )
        `), 'usage']
      ],
      where: where(fn('DATE_FORMAT', col('time'), '%Y-%m'), month),
      group: [fn('DATE', col('time'))],
      order: [[literal('date'), 'ASC']],
      raw: true
    });

    res.json(
      rows.map(r => ({
        date:  r.date,
        usage: Number(r.usage)
      }))
    );
  } catch (err) {
    console.error('Error fetching daily usage:', err);
    res.status(500).json({ error: 'Failed to fetch daily usage' });
  }
});

module.exports = router;
