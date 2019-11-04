const express = require('express');
const path = require('path');
const axios = require('axios');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter);

const router = express.Router();

const http = axios.create({ baseURL: 'https://api.creditkudos.com' });

router.get('/', async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const authHeader = Buffer.from(clientId + ':' + clientSecret).toString('base64');

  // Create Connect API Access Token
  const response = await http.post(
    '/v3/connect/token',
    {
      email: 'sam.pull@example.com',
      firstName: 'Sam',
      lastName: 'Pull',
      customReference: 'SP-123',
      dateOfBirth: '1985-10-25',
      postcode: 'XY12AB',
    },
    {
      headers: { 'Authorization': `Basic ${authHeader}` }
    }
  );
  const connectAccessToken = response.data.access_token;
  db.set('connectAccessToken', connectAccessToken).write();

  res.render('index.html.ejs', { connectAccessToken });
});

router.get('/callback', (req, res) => {
  const { connection_id } = req.query;
  const connectAccessToken = db.get('connectAccessToken')
  res.render('callback.html.ejs', { connectionId: connection_id, connectAccessToken });
});

router.get('/complete', async (req, res) => {
  const connectAccessToken = db.get('connectAccessToken')

  const response =
    // Create Authorization Code
    await http.post(
      '/oauth/authorize',
      {
        clientId: process.env.CLIENT_ID,
        redirectURI: process.env.REDIRECT_URI,
      },
      {
        headers: { 'Authorization': `Bearer ${connectAccessToken}` }
      }
    ).then(res => {
      // Exchange code for API Access Token
      return http.post(
        '/oauth/token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: res.data.code,
          grant_type: 'authorization_code',
          scope: 'report user:info',
        }
      );
    });

  const accessToken = response.data.access_token;

  res.render('complete.html.ejs', { accessToken });
});

router.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', '/error.html'));
});

module.exports = router;
