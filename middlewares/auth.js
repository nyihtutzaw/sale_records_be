// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const { promisify } = require('util');
// eslint-disable-next-line import/order, import/no-extraneous-dependencies
const dotenv = require('dotenv');

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  dotenv.config();
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: 'Unauthorized request.',
      howToFix: 'You forgot to send your authorization token.',
    });
  }

  if (authorization.indexOf('Bearer') !== 0) {
    return res.status(401).json({
      message: 'Malformatted token.',
      howToFix: 'Provide a valid authorization token.',
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.id = decoded.id;
  } catch (err) {
    console.log('midlewares.auth', err.message);
    return res.status(401).json({
      message: 'Invalid token.',
      howToFix: 'Provide a valid authorization token.',
    });
  }
  return next();
};
