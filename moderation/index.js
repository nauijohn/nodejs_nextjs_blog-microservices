const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {});

app.listen(4003, async () => {
  console.log('Moderation service listening on port 4003...');
});
