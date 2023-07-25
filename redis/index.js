const redis = require('redis');

const { REDIS_URL, REDIS_PORT } = require('../config');

const redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
  // host: REDIS_URL,
  // port: REDIS_PORT,
  // password: 'mXBNV5jPKgV3j0uHRfnBlnT8ReqslosZ',
});

module.exports = redisClient;
