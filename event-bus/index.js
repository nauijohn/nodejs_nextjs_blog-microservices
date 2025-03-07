const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
  try {
    console.log('Received Event', req.body.type);
    const event = req.body;

    events.push(event);

    await Promise.allSettled([
      axios.post('http://posts-clusterip-srv:4000/events', event),
      axios.post('http://comments-srv:4001/events', event),
      axios.post('http://query-srv:4002/events', event),
      axios.post('http://moderation-srv:4003/events', event),
    ]);
  } catch (error) {
    console.error(error);
  }
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event-bus service listening on 4005...');
});
