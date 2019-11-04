const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const http = require('axios');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter);

const router = express.Router();

router.get('/', (req, res) => {
  const customerToken = jwt.sign({
    iss: process.env.CLIENT_ID,
    sub: 'customer',
    iat: new Date() / 1000,
    jti: uuid(),
    email: 'sam.pull@example.com',
    first_name: 'Sam',
    last_name: 'Pull',
    custom_reference: 'SP-123',
    date_of_birth: '1985-10-25',
    postcode: 'XY12AB',
  }, process.env.CLIENT_SECRET, { algorithm: 'HS256' });

  res.render('index.html.ejs', { customerToken });
});

router.get('/callback', (req, res) => {
  const { code, error, error_description } = req.query;

  if (code) {
    http.post('https://api.creditkudos.com/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      scope: 'report user:info',
    }).then((res) => {
      db.set('accessToken', res.data.access_token).write();
    });
  } else if (error) {
    db.set('error', `code: ${error}, description: ${error_description}`).write();
  }

  res.sendFile(path.join(__dirname, '..', 'views', '/callback.html'));
});

router.get('/complete', (req, res) => {
  const accessToken = db.get('accessToken');
  res.render('complete.html.ejs', { accessToken });
});

router.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', '/error.html'));
});

module.exports = router;
