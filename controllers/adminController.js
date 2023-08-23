// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { ADMIN_CACHE_KEY } = require('../constants/cacheKeys');
const Admin = require('../models/model.admin');
const redisClient = require('../redis');

class AdminController {
  // eslint-disable-next-line class-methods-use-this, consistent-return
  async login(req, res) {
    try {
      dotenv.config();
      const { email, password } = req.body;

      const admin = await Admin.findOne({
        where: {
          email,
        },
      });

      if (!admin) return res.status(405).json({ message: 'email not found' });

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) return res.status(405).json({ message: 'password not match' });

      const responseObj = {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
        token: jwt.sign(
          { id: admin.id, role: 'admin' },
          process.env.JWT_SECRET,
        ),
      };

      return res
        .status(200)
        .json({ message: 'Login Success', data: responseObj });
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async store(req, res) {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      const hashedPassword = await bcrypt.hash(password, salt);
      const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
      });
      return res.status(200).json({ data: admin });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving user' });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async index(req, res) {
    try {
      const result = await Admin.findAll();
      if (result.length > 0) {
        await redisClient.set(ADMIN_CACHE_KEY, JSON.stringify(result), {
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
      const result = await Admin.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'User Not Found' });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  async update(req, res) {
    try {
      const result = await Admin.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Admin Not Found' });
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
      const result = await Admin.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!result) {
        return res.status(404).json({ message: 'Admin Not Found' });
      }
      return res.status(200).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'error' });
    }
  }
}
module.exports = new AdminController();
