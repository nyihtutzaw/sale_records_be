const { PAYMENT_METHOD_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const PaymentMethodCache = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(PAYMENT_METHOD_CACHE_KEY);
    if (cachedData) {
      const payment = JSON.parse(cachedData);
      res.json({ data: payment });
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

module.exports = PaymentMethodCache;
