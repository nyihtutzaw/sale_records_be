// eslint-disable-next-line import/no-extraneous-dependencies
const { body, check } = require('express-validator');

const Admin = require('../models/model.admin');

// eslint-disable-next-line camelcase
const Admin_Create_Validation = [
  body('name').isLength(1),
  body('email').isLength(1),
  body('password').isLength(1),

  check('email').custom(async (email) => {
    const existingUser = await Admin.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('Email already exists');
    }
  }),
];

// eslint-disable-next-line camelcase
const Admin_Login_Validation = [
  body('email').isLength(1),
  body('password').isLength(1),
];

// eslint-disable-next-line camelcase
const Customer_Create_Validation = [
  body('name').isLength(1),
  body('phone').isLength(1),
];
// eslint-disable-next-line camelcase
const Product_Create_Validation = [
  body('name').isLength(1),
  body('price').isLength(1),
];

// eslint-disable-next-line camelcase
const Sale_Record_Create_Validation = [
  body('customer_id').isLength(1),
  body('date').isLength(1),
  body('sale_record_details').isLength(1),
];

// eslint-disable-next-line camelcase
// const Sale_Record_Detail_Create_Validation = [
//   body('product_id').isLength(1),
//   body('sale_record_id').isLength(1),
//   body('price').isLength(1),
//   body('qty').isLength(1),
// ];

module.exports = {
  // eslint-disable-next-line camelcase
  Admin_Create_Validation,
  // eslint-disable-next-line camelcase
  Customer_Create_Validation,
  // eslint-disable-next-line camelcase
  Product_Create_Validation,
  // eslint-disable-next-line camelcase
  Admin_Login_Validation,
  // eslint-disable-next-line camelcase
  Sale_Record_Create_Validation,
  // eslint-disable-next-line camelcase
  // Sale_Record_Detail_Create_Validation,
};
