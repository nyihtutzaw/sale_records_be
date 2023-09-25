const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const SaleRecord = sequelize.define('sale_record', {
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  delivery_method_id: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// SaleRecord.sync({ alter: true });
module.exports = SaleRecord;
