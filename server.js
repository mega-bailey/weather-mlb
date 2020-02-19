// require('dotenv').config();

// const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/weather', (req, res) => {
  const url = `https://api.darksky.net/forecast/c3e551f48e3c56baf9fb50a8ae8d2444/${req.body.latitude},${req.body.longitude}?units=auto`;
  axios({
    url: url,
    responseType: 'json'
  }).then(data => res.json(data.data));
});

app.listen(PORT, () => {
  console.log('server started');
});
