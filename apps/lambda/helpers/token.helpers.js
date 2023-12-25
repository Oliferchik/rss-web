const jwt = require('jsonwebtoken');

const decodeToken = (req) => {
  const { headers } = req;

  const invalidTokenError = new Error('Invalid token');
  invalidTokenError.statusCode = 401;

  if (!headers?.authorization) {
    console.error('Header with token doesn`t exist');

    throw invalidTokenError;
  }

  const authHeader = headers?.authorization;

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    console.error('Invalid token', error.message);

    throw invalidTokenError;
  }
};

module.exports = {
  decodeToken,
};
