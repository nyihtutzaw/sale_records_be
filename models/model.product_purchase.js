const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const ProductPurchase = sequelize.define('product_purchase', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  initPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wholeSalePrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ProductPurchase;
