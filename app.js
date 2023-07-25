// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
// const UserCache = require('./caches/cache.user');
const sequelize = require('./database/index');
// const User = require('./models/model.user');
const redisClient = require('./redis');
const routes = require('./routes');
// Sync the models with the database
sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('Database synced');
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Error syncing database:', error);
});

(async () => {
  await redisClient.connect();
})();

// eslint-disable-next-line no-console
redisClient.on('connect', () => console.log('Redis Client Connected'));
// eslint-disable-next-line no-console
redisClient.on('error', (err) => console.log('Redis Client Connection Error', err));

app.use(express.json());
app.use(cors());

// Set up routes
routes(app);

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
