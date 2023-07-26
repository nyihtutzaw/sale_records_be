const { SALE_RECORD_CACHE_KEY } = require('../constants/cacheKeys');
const { SaleRecord, SaleRecordDetail } = require('../models');
const redisClient = require('../redis');

class SaleRecordController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { customer_id, date, sale_record_details } = req.body;

      const saleRecord = await SaleRecord.create({
        // eslint-disable-next-line camelcase
        customer_id,
        date,
        created_by: req.id,
        // eslint-disable-next-line camelcase
        sale_record_details,
      }, {
        // eslint-disable-next-line camelcase
        include: [SaleRecordDetail],
      });
      return res.status(200).json({ data: saleRecord });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving SaleRecord' });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async index(req, res) {
    const query = {};

    try {
      const result = await SaleRecord.findAll({
        where: query,
        include: [
          {
            model: SaleRecordDetail,
            as: 'sale_record_details',
          },
        ],
      });

      if (result.length > 0) {
        await redisClient.set(SALE_RECORD_CACHE_KEY, JSON.stringify(result), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({ data: result });
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