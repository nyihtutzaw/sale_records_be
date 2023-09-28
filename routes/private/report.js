const ProfitReportCache = require('../../caches/cache.profit_report');
const ReportController = require('../../controllers/reportController');

module.exports = (routes) => {
  routes.get('/report/profit', ProfitReportCache, ReportController.profitReport);
};
