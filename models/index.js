const Admin = require('./model.admin');
const Customer = require('./model.customer');
const DeliveryMethod = require('./model.delivery_method');
const PaymentMethod = require('./model.payment_method');
const Product = require('./model.product');
const ProductPurchase = require('./model.product_purchase');
const SaleRecord = require('./model.sale_record');
const SaleRecordDetail = require('./model.sale_record_detail');

SaleRecord.belongsTo(Customer, {
  foreignKey: 'customer_id',
});
SaleRecord.belongsTo(Admin, {
  foreignKey: 'created_by',
});
SaleRecord.belongsTo(PaymentMethod, {
  foreignKey: 'payment_method_id',
});
SaleRecord.belongsTo(DeliveryMethod, {
  foreignKey: 'delivery_method_id',
});
SaleRecordDetail.belongsTo(Product, {
  foreignKey: 'product_id',
});
SaleRecordDetail.belongsTo(SaleRecord, {
  foreignKey: 'saleRecordId',
});

Product.hasMany(SaleRecordDetail, {
  foreignKey: 'product_id',
});
SaleRecord.hasMany(SaleRecordDetail);

Product.hasMany(ProductPurchase, {
  foreignKey: 'product_id',
});
ProductPurchase.belongsTo(Product, {
  foreignKey: 'product_id',
});

module.exports = {
  SaleRecord,
  SaleRecordDetail,
  Customer,
  Product,
  Admin,
  PaymentMethod,
  ProductPurchase,
  DeliveryMethod,
};
