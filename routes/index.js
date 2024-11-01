const { Router } = require('express');

const AuthMiddleware = require('../middlewares/auth');

const AdminRoutes = require('./private/admin');
const CustomerRoutes = require('./private/customer');
const DeliveryMethodRoutes = require('./private/delivery_method');
const InvoiceSettingRoutes = require('./private/invoice_setting');
const PaymentMethodRoutes = require('./private/payment_method');
const ProductRoutes = require('./private/product');
const ReportRoutes = require('./private/report');
const SaleRecordRoutes = require('./private/sale_record');
const PublicRoutes = require('./public');

module.exports = (app) => {
  const routes = Router();
  // const apiLimiter = new RateLimit({
  //   windowMs: 10 * 60 * 1000, // 10 minutes
  //   max: 100,
  //   message:
  //     'Too many requests from this IP, please try again after 10 minutes.',
  // })
  PublicRoutes(routes);
  routes.use(AuthMiddleware);
  ProductRoutes(routes);
  CustomerRoutes(routes);
  AdminRoutes(routes);
  SaleRecordRoutes(routes);
  PaymentMethodRoutes(routes);
  DeliveryMethodRoutes(routes);
  InvoiceSettingRoutes(routes);
  ReportRoutes(routes);
  // app.use('/api/', [apiLimiter, routes])
  app.use('/api/', [routes]);
};
