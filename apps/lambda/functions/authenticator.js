const jwt = require('jsonwebtoken');

const userHelpers = require('../helpers/user.helpers');

const generaJwtToken = async (email) => {
  const secretKey = process.env.SECRET_KEY;
  const options = { expiresIn: '1h' };
  const user = await userHelpers.getUserByEmail(email);

  return jwt.sign({ email, rssUrl: user.rssFeedUrl }, secretKey, options);
};

const isPasswordValid = async ({ email, password }) => {
  const user = await userHelpers.getUserByEmail(email);

  if (user?.password === password) {
    return true;
  }

  return false;
};

const errorBody = {
  statusCode: 401,
  body: {
    errors: { credentials: 'The email or password you have entered is invalid' },
  },
};

module.exports.handler = async (event) => {
  if (!event?.body) {
    return errorBody;
  }

  const requestBody = JSON.parse(event.body);
  const { email, password } = requestBody || {};

  const isValid = await isPasswordValid({ email, password });

  if (!isValid) {
    return errorBody;
  }

  const message = await generaJwtToken(email);

  const body = { message };

  return {
    statusCode: 200,
    body: JSON.stringify(body, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT',
    },
  };
};
