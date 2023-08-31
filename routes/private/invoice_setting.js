const InvoiceSettingCache = require('../../caches/cache.invoice_setting');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const invoiceSettingController = require('../../controllers/invoiceSettingController');
// const {
//   // eslint-disable-next-line camelcase
//   InvoiceSetting_Create_Validation,
// } = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/invoice-setting/store',
    // InvoiceSetting_Create_Validation,
    Validate_Request,
    invoiceSettingController.store,
  );
  routes.get('/invoice-setting', InvoiceSettingCache, invoiceSettingController.index);
  routes.put('/invoice-setting/:id', invoiceSettingController.update);
  routes.delete('/invoice-setting/:id', invoiceSettingController.delete);
};
