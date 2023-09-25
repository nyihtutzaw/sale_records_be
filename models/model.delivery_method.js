const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const DeliveryMethod = sequelize.define('delivery_method', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = DeliveryMethod;
