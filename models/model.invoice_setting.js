const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const InvoiceSetting = sequelize.define('invoice_setting', {
  company_name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.STRING,
  },
});

module.exports = InvoiceSetting;
