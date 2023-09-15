const { PRODUCT_PURCHASE_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const ProductPurchaseCache = async (req, res, next) => {
  try {
    const cacheKey = `${PRODUCT_PURCHASE_CACHE_KEY}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      const purchase = JSON.parse(cachedData);
      res.json({ data: purchase });
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

module.exports = ProductPurchaseCache;
