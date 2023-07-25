// const UserCache = require('../../caches/cache.user');
// const User = require('../../models/model.user');
// const redisClient = require('../../redis');
// eslint-disable-next-line import/order
const AdminController = require('../../controllers/adminController');
// eslint-disable-next-line camelcase, import/order
const Validate_Request = require('../../controllers/index');
const {
  // eslint-disable-next-line camelcase
  Admin_Login_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.get('/', (req, res) => {
    res.send('Hello World');
  });

  routes.post(
    '/admin/login',
    Admin_Login_Validation,
    Validate_Request,
    AdminController.login,
  );
};
