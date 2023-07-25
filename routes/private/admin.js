const AdminCache = require('../../caches/cache.admin');
// eslint-disable-next-line camelcase
const Validate_Request = require('../../controllers');
const AdminController = require('../../controllers/adminController');
const {
  // eslint-disable-next-line camelcase
  Admin_Create_Validation,
} = require('../../validations');

module.exports = (routes) => {
  routes.post(
    '/admin/store',
    Admin_Create_Validation,
    Validate_Request,
    AdminController.store,
  );
  routes.get('/admin', AdminCache, AdminController.index);
  routes.get('/admin/:id', AdminController.each);
  routes.put('/admin/:id', AdminController.update);
  routes.delete('/admin/:id', AdminController.delete);
};
