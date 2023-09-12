const { SALE_RECORD_CACHE_KEY } = require('../constants/cacheKeys');
const { SaleRecordDetail } = require('../models');
const redisClient = require('../redis');

class SaleRecordDetailController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await SaleRecordDetail.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'SaleRecord Detail Not Found' });
      }
      await redisClient.expire(SALE_RECORD_CACHE_KEY, 0);

      return res.status(200).json({ message: 'Successfully Updated' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async delete(req, res) {
    try {
      const result = await SaleRecordDetail.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'SaleRecord Not Found' });
      }
      await redisClient.expire(SALE_RECORD_CACHE_KEY, 0);
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new SaleRecordDetailController();
