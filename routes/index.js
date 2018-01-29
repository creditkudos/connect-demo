const express = require('express');
const path = require('path');
const router = express.Router();

const api = require('../util');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

/* GET home page. */
router.get('/callback', (req, res) => {
  const { code } = req.query;
  const accessTokenPromise = api.fetchAccessToken(code);

  accessTokenPromise
    .then((accessToken) => {
      api.fetchUser(accessToken)
        .then(res => console.log(res.data));

      api.fetchReports(accessToken)
        .then((res) => {
          res.data.reports.forEach((report) => {
            api.fetchReport(report.id, accessToken)
              .then(res => console.log(res.data));
          });
        })
    });

  res.sendFile(path.join(__dirname, '..', 'views', '/callback.html'));
});

module.exports = router;
