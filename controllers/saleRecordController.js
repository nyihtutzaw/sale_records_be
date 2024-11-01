const { SALE_RECORD_CACHE_KEY } = require('../constants/cacheKeys');
const sequelize = require('../database');
const {
  SaleRecord, SaleRecordDetail, Product, Customer, PaymentMethod, DeliveryMethod,
} = require('../models');
const redisClient = require('../redis');

class SaleRecordController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    const t = await sequelize.transaction();
    try {
      // eslint-disable-next-line camelcase
      const {
      // eslint-disable-next-line camelcase
        customer_id, payment_method_id, date, sale_record_details, delivery_method_id,
      } = req.body;

      const saleRecord = await SaleRecord.create({
        // eslint-disable-next-line camelcase
        customer_id,
        // eslint-disable-next-line camelcase
        payment_method_id,
        // eslint-disable-next-line camelcase
        delivery_method_id,
        date,
        created_by: req.id,
        // eslint-disable-next-line camelcase
        sale_record_details,
      }, {
        // eslint-disable-next-line camelcase
        include: [SaleRecordDetail],
      }, { transaction: t });

      try {
        // eslint-disable-next-line camelcase
        sale_record_details?.forEach(async (record) => {
          await Product.decrement({
            qty: record?.qty,
          }, {
            where: {
              id: record?.product_id,
            },
          });
        });
      } catch (error) {
        await t.rollback();
      }
      await t.commit();

      return res.status(200).json({ data: saleRecord });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(500).json({ message: 'Error saving SaleRecord' });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async index(req, res) {
    const query = {};
    const pagination = {};
    const { limit, page } = req.query;
    if (limit) {
      pagination.limit = parseInt(limit, 10);
    }
    if (page) {
      pagination.offset = ((parseInt(page - 1, 10)) * parseInt(limit, 10));
    }
    try {
      const result = await SaleRecord.findAll({
        where: query,
        order: [
          ['id', 'DESC'],
        ],
        ...pagination,
        include: [
          {
            model: SaleRecordDetail,
            as: 'sale_record_details',
            include: [
              {
                model: Product,
                as: 'Product',
              },
            ],
          },
          {
            model: Customer,
            as: 'Customer',
          },
          {
            model: PaymentMethod,
            as: 'payment_method',
          },
          {
            model: DeliveryMethod,
            as: 'delivery_method',
          },
        ],
      });
      const total = await SaleRecord.count({ where: query });

      if (result.length > 0) {
        const cacheKey = `${SALE_RECORD_CACHE_KEY}, ${Object.values(pagination).join('')}, ${Object.values(query).join('')}`;
        await redisClient.set(cacheKey, JSON.stringify({ result, total }), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({ data: result, total });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async each(req, res) {
    try {
      const result = await SaleRecord.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: SaleRecordDetail,
            as: 'sale_record_details',
            include: [
              {
                model: Product,
                as: 'Product',
              },
            ],
          },
          {
            model: Customer,
            as: 'Customer',
          },
          {
            model: PaymentMethod,
            as: 'payment_method',
          },
          {
            model: DeliveryMethod,
            as: 'delivery_method',
          },
        ],
      });

      if (!result) {
        return res.status(404).json({ message: 'SaleRecord Not Found' });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await SaleRecord.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'SaleRecord Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Updated' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async delete(req, res) {
    try {
      const result = await SaleRecord.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'SaleRecord Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new SaleRecordController();
