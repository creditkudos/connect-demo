// Load env vars into process.env
require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');

const PORT = 8888;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', routes);

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(PORT, () => {
  console.log(`Credit Kudos Connect Demo app listening on port ${PORT}`);
})
