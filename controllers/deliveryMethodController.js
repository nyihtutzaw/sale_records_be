const { DELIVERY_METHOD_CACHE_KEY } = require('../constants/cacheKeys');
const DeliveryMethod = require('../models/model.delivery_method');
const redisClient = require('../redis');

class DeliveryMethodController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { name } = req.body;

      const result = await DeliveryMethod.create({
        name,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving DeliveryMethod' });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async index(req, res) {
    const query = {};

    try {
      const result = await DeliveryMethod.findAll({
        where: query,
      });

      if (result.length > 0) {
        await redisClient.set(DELIVERY_METHOD_CACHE_KEY, JSON.stringify(result), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async each(req, res) {
    try {
      const result = await DeliveryMethod.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'DeliveryMethod Not Found' });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await DeliveryMethod.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'DeliveryMethod Not Found' });
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
      const result = await DeliveryMethod.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'DeliveryMethod Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new DeliveryMethodController();
