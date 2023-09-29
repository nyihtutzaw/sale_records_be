const { SALE_RECORD_DETAIL_CACHE_KEY } = require('../constants/cacheKeys');
const sequelize = require('../database');
const redisClient = require('../redis');

class ReportController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async profitReport(req, res) {
    if (!req.query.start_date || !req.query.end_date) {
      res.status(401).json({ message: 'Date range filter is not included' });
    }

    try {
      const startDate = req.query.start_date;
      const endDate = req.query.end_date;

      const result = await sequelize.query(`
      SELECT
        P.name,
        SUM(SRD.qty) AS totalQty,
        SUM(SRD.qty) * SRD.price AS totalSoldAmount,
        SUM(SRD.qty) * P.price AS totalPurchaseAmount,
        (SUM(SRD.qty * P.price) - SUM(SRD.qty * SRD.price)) AS profit
        FROM
        sale_record_details SRD
        INNER JOIN sale_records SR ON SRD.saleRecordId = SR.id
        INNER JOIN products P ON SRD.product_id = P.id
        WHERE
        SR.date >= :startDate AND SR.date <= :endDate
      GROUP BY
        SRD.product_id
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { startDate, endDate },
      });
      if (result.length > 0) {
        const cacheKey = SALE_RECORD_DETAIL_CACHE_KEY;
        await redisClient.set(cacheKey, JSON.stringify({ result }), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
}
module.exports = new ReportController();
