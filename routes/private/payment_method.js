const PaymentMethodCache = require('../../caches/cache.payment_method');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const PaymentMethodController = require('../../controllers/paymentMethodController');
const {
  // eslint-disable-next-line camelcase
  PaymentMethod_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/payment-method/store',
    PaymentMethod_Create_Validation,
    Validate_Request,
    PaymentMethodController.store,
  );
  routes.get('/payment-method', PaymentMethodCache, PaymentMethodController.index);
  routes.get('/payment-method/:id', PaymentMethodController.each);
  routes.put('/payment-method/:id', PaymentMethodController.update);
  routes.delete('/payment-method/:id', PaymentMethodController.delete);
};
