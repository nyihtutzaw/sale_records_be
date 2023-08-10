const SaleRecordCache = require('../../caches/cache.sale_record');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const SaleRecordController = require('../../controllers/saleRecordController');
const {
  // eslint-disable-next-line camelcase
  Sale_Record_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/sale-record/store',
    Sale_Record_Create_Validation,
    Validate_Request,
    SaleRecordController.store,
  );
  routes.get('/sale-record', SaleRecordCache, SaleRecordController.index);
  routes.get('/sale-record/:id', SaleRecordController.each);
  routes.put('/sale-record/:id', SaleRecordController.update);
  routes.delete('/sale-record/:id', SaleRecordController.delete);
};
