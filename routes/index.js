const { Router } = require('express');

const AdminRoutes = require('./private/admin');
const CustomerRoutes = require('./private/customer');
const ProductRoutes = require('./private/product');
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
  ProductRoutes(routes);
  CustomerRoutes(routes);
  AdminRoutes(routes);
  // app.use('/api/', [apiLimiter, routes])
  app.use('/api/', [routes]);
};
