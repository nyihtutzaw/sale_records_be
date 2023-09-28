const { PROFIT_REPORT_CACHE_KEY } = require('../constants/cacheKeys');
const redisClient = require('../redis');

const ProfitReportCache = async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(PROFIT_REPORT_CACHE_KEY);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      const products = data?.result;
      const totalProfit = data?.totalProfit;
      res.json({ data: products, totalProfit });
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
