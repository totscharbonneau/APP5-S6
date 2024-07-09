const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const moment = require('moment');

const router = express.Router();

router.get('/', (req, res) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, '../data.csv'))
    .pipe(csv({ headers: false }))
    .on('data', (data) => {
      // Convert Unix milliseconds to a readable date
      const timestamp = moment(parseInt(data[0])).format('YYYY-MM-DD HH:mm:ss');
      results.push({
        timestamp: timestamp,
        uuid: data[1]
      });
    })
    .on('end', () => {
      res.render('index', { data: results });
    });
});

module.exports = router;
