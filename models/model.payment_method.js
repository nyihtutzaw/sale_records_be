const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const PaymentMethod = sequelize.define('payment_method', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = PaymentMethod;
