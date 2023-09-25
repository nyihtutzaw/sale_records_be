const { DELIVERY_METHOD_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const DeliveryMethodCache = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(DELIVERY_METHOD_CACHE_KEY);
    if (cachedData) {
      const Delivery = JSON.parse(cachedData);
      res.json({ data: Delivery });
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

module.exports = DeliveryMethodCache;
