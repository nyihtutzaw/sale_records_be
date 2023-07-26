const CustomerCache = require('../../caches/cache.customer');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const CustomerController = require('../../controllers/customerController');
const {
  // eslint-disable-next-line camelcase
  Customer_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/customer/store',
    Customer_Create_Validation,
    Validate_Request,
    CustomerController.store,
  );
  routes.get('/customer', CustomerCache, CustomerController.index);
  routes.get('/customer/:id', CustomerController.each);
  routes.put('/customer/:id', CustomerController.update);
  routes.delete('/customer/:id', CustomerController.delete);
};
