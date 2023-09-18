const { PRODUCT_PURCHASE_CACHE_KEY } = require('../constants/cacheKeys');
const sequelize = require('../database');
const { ProductPurchase } = require('../models');
const Product = require('../models/model.product');
const redisClient = require('../redis');

class ProductPurchaseController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    const t = await sequelize.transaction();
    try {
      // eslint-disable-next-line camelcase
      const {
        // eslint-disable-next-line camelcase
        product_id, price, initPrice, wholeSalePrice, qty, date,
      } = req.body;

      const result = await ProductPurchase.create({
        // eslint-disable-next-line camelcase
        product_id,
        price,
        initPrice,
        qty,
        wholeSalePrice,
        date,
      }, { transaction: t });
      await Product.increment(
        { qty },
        {
          where: {
            // eslint-disable-next-line camelcase
            id: product_id,
          },
          transaction: t,
        },
      );
      await Product.update(
        { initPrice, price, wholeSalePrice },
        {
          where: {
            // eslint-disable-next-line camelcase
            id: product_id,
          },
          transaction: t,
        },
      );
      await t.commit();
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(500).json({ message: 'Error saving Product' });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async index(req, res) {
    try {
      const result = await ProductPurchase.findAll({
        include: [
          {
            model: Product,
            as: 'Product',
          },
        ],
      });

      if (result.length > 0) {
        await redisClient.set(PRODUCT_PURCHASE_CACHE_KEY, JSON.stringify(result), {
          EX: 100,
          NX: true,
        });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
}
module.exports = new ProductPurchaseController();
