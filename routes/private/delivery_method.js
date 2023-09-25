const deliveryMethodCache = require('../../caches/cache.delivery_method');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const DeliveryMethodController = require('../../controllers/deliveryMethodController');
const {
  // eslint-disable-next-line camelcase
  DeliveryMethod_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/delivery-method/store',
    DeliveryMethod_Create_Validation,
    Validate_Request,
    DeliveryMethodController.store,
  );
  routes.get('/delivery-method', deliveryMethodCache, DeliveryMethodController.index);
  routes.get('/delivery-method/:id', DeliveryMethodController.each);
  routes.put('/delivery-method/:id', DeliveryMethodController.update);
  routes.delete('/delivery-method/:id', DeliveryMethodController.delete);
};
