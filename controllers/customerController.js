const { CUSTOMER_CACHE_KEY } = require('../constants/cacheKeys');
const Customer = require('../models/model.customer');
const redisClient = require('../redis');

class CustomerController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { name, phone, address } = req.body;

      const result = await Customer.create({
        name,
        phone,
        address,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving Customer' });
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
      const result = await Customer.findAll({
        where: query,
        ...pagination,
      });
      const total = await Customer.count({ where: query });

      if (result.length > 0) {
        const cacheKey = `${CUSTOMER_CACHE_KEY}, ${Object.values(pagination).join('')}, ${Object.values(query).join('')}`;
        await redisClient.set(cacheKey, JSON.stringify({ result, total }), {
          EX: 10,
          NX: true,
        });
      }
      return res.status(200).json({ data: result, total });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async each(req, res) {
    try {
      const result = await Customer.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Customer Not Found' });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await Customer.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Customer Not Found' });
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
      const result = await Customer.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Customer Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new CustomerController();
