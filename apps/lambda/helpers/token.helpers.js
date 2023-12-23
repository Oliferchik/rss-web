const jwt = require('jsonwebtoken');

const decodeToken = (event) => {
  const { headers } = event;

  const errorMessage = 'Invalid token';
  if (!headers?.authorization) {
    console.error('Header with token doesn`t exist');

    throw new Error(errorMessage);
  }

  const authHeader = headers?.authorization;

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    console.error('Invalid token', error.message);

    throw new Error(errorMessage);
  }
};

module.exports = {
  decodeToken,
};
