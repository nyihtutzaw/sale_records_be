const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const SaleRecord = sequelize.define('sale_record_detail', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // sale_record_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = SaleRecord;
