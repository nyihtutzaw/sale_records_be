const { PRODUCT_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const ProductCache = async (req, res, next) => {
  try {
    const query = {};
    const pagination = {};
    const { limit, page } = req.query;
    pagination.limit = limit ? parseInt(limit, 10) : 10;
    pagination.offset = page ? ((parseInt(page - 1, 10)) * parseInt(limit, 10)) : 0;

    const cacheKey = `${PRODUCT_CACHE_KEY}, ${Object.values(pagination).join('')}, ${Object.values(query).join('')}`;
    const cachedData = await redisClient.get(cacheKey);

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

module.exports = ProductCache;
