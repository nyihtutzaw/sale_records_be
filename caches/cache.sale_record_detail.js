const { SALE_RECORD_DETAIL_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const SaleRecordDetailCache = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(SALE_RECORD_DETAIL_CACHE_KEY);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      const products = data?.result;
      const total = data?.total;
      res.json({ data: products, total });
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

module.exports = SaleRecordDetailCache;
