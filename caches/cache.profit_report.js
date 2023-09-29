const { PROFIT_REPORT_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const ProfitReportCache = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { start_date, end_date } = req.query;
    // eslint-disable-next-line camelcase
    const cacheKey = `${PROFIT_REPORT_CACHE_KEY}${start_date}${end_date}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      const products = data?.result;
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

module.exports = ProfitReportCache;
