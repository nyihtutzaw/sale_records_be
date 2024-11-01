// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_HOST: process.env.MYSQL_HOST,
  REDIS_URL: process.env.REDIS_URL || 'redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
};
