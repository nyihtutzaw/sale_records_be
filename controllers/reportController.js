const { Op } = require('sequelize');

const { SALE_RECORD_DETAIL_CACHE_KEY } = require('../constants/cacheKeys');
const sequelize = require('../database');
const { SaleRecordDetail, Product, SaleRecord } = require('../models');
const redisClient = require('../redis');

class ReportController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async profitReport(req, res) {
    const t = await sequelize.transaction();
    const query = {};
    if (req.query.start_date && req.query.end_date) {
      query.date = {
        [Op.gte]: req.query.start_date,
        [Op.lte]: req.query.end_date,
      };
    }
    try {
      const result = await SaleRecordDetail.findAll({
        order: [
          ['id', 'DESC'],
        ],
        include: [
          {
            model: SaleRecord,
            required: true,
            where: query,
          },
          {
            model: Product,
            as: 'Product',
          },
        ],
      }, { transaction: t });

      const totals = result.reduce(
        (acc, record) => {
          acc.totalQty += record.qty;
          acc.totalPrice += record.price;
          return acc;
        },
        { totalQty: 0, totalPrice: 0 },
      );

      let totalProfit = 0;
      if (totals.totalPrice > 0) {
        const sumOfSoldProductInitPrices = await Product.sum('initPrice', {
          include: [
            {
              model: SaleRecordDetail,
              required: true,
            },
          ],
        }, { transaction: t });
        totalProfit = (totals.totalPrice * totals.totalQty)
      - (sumOfSoldProductInitPrices * totals.totalQty);
      }

      if (result.length > 0) {
        const cacheKey = SALE_RECORD_DETAIL_CACHE_KEY;
        await redisClient.set(cacheKey, JSON.stringify({ result, totalProfit }), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({
        data: result,
        totalProfit,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: error });
    }
  }
}
module.exports = new ReportController();
