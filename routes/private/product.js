const ProductCache = require('../../caches/cache.product');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const ProductController = require('../../controllers/productController');
const {
  // eslint-disable-next-line camelcase
  Product_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/product/store',
    Product_Create_Validation,
    Validate_Request,
    ProductController.store,
  );
  routes.get('/product', ProductCache, ProductController.index);
  routes.get('/product/:id', ProductController.each);
  routes.put('/product/:id', ProductController.update);
  routes.delete('/product/:id', ProductController.delete);
};
