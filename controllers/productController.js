const { Op } = require('sequelize');

const { PRODUCT_CACHE_KEY } = require('../constants/cacheKeys');
const { ProductPurchase } = require('../models');
const Product = require('../models/model.product');
const redisClient = require('../redis');

class ProductController {
  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const {
        name, price, initPrice, wholeSalePrice, qty,
      } = req.body;

      const result = await Product.create({
        name,
        price,
        initPrice,
        qty,
        wholeSalePrice,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving Product' });
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
      const result = await Product.findAll({
        where: query,
        order: [
          ['id', 'DESC'],
        ],
        ...pagination,
        include: [
          {
            model: ProductPurchase,
            as: 'product_purchases',
          },
        ],
      });

      const total = await Product.count({ where: query });

      if (result.length > 0) {
        const cacheKey = `${PRODUCT_CACHE_KEY}, ${Object.values(pagination).join('')}, ${Object.values(query).join('')}`;
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
  async getProducts(req, res) {
    const query = {};
    if (req.query.search) {
      query.name = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    try {
      const result = await Product.findAll({
        where: query,
      });

      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async each(req, res) {
    try {
      const result = await Product.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: ProductPurchase,
            as: 'product_purchases',
          },
        ],
        order: [
          ['id', 'DESC'],
          [ProductPurchase, 'id', 'DESC'],
        ],
      });
      if (!result) {
        return res.status(404).json({ message: 'Product Not Found' });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Product Not Found' });
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
      const result = await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Product Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new ProductController();
