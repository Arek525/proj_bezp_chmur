const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const redisClient = redis.createClient({
  url: `redis://redis:${process.env.REDIS_PORT || 6379}`,
});


redisClient.connect().catch(console.error);


app.post('/message', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  await redisClient.rPush('messages', message);
  res.json({ status: 'Message added' });
});


app.get('/messages', async (req, res) => {
  const messages = await redisClient.lRange('messages', 0, -1);
  res.json({ messages });
});



app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
});