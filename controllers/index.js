// eslint-disable-next-line import/no-extraneous-dependencies
const { validationResult } = require('express-validator');

// eslint-disable-next-line camelcase
const Validate_Request = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } return next();
};

// eslint-disable-next-line camelcase
module.exports = Validate_Request;
