const Admin = require('./model.admin');
const Customer = require('./model.customer');
const Product = require('./model.product');
const SaleRecord = require('./model.sale_record');
const SaleRecordDetail = require('./model.sale_record_detail');

SaleRecord.belongsTo(Customer, {
  foreignKey: 'customer_id',
});
SaleRecord.belongsTo(Admin, {
  foreignKey: 'created_by',
});
// SaleRecordDetail.belongsTo(SaleRecord, {
//   foreignKey: 'sale_record_id',
// });
SaleRecordDetail.belongsTo(Product, {
  foreignKey: 'product_id',
});
SaleRecord.hasMany(SaleRecordDetail);

module.exports = {
  SaleRecord,
  SaleRecordDetail,
  Customer,
  Product,
  Admin,
};
