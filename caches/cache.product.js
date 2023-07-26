const { PRODUCT_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const ProductCache = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(PRODUCT_CACHE_KEY);
    if (cachedData) {
      const products = JSON.parse(cachedData);
      res.json({ data: products });
    } else {
      // If cache miss, continue to route handler
      next();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = ProductCache;
