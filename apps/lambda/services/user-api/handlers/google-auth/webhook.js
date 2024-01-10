const jwt = require('jsonwebtoken');
const { URLSearchParams, URL } = require('url');

const googleSdk = require('./google-sdk');

const { TOKEN_SECRET_KEY, WEB_URL } = process.env;

const generaJwtToken = async (email) => {
  const options = { expiresIn: '1h' };

  return jwt.sign({ email }, TOKEN_SECRET_KEY, options);
};

module.exports.handler = async ({ queryStringParameters }) => {
  const { isValid, payload } = await googleSdk.exchangeCodeForToken(queryStringParameters.code);

  if (!isValid) {
    console.info('Google validation failed');

    return {
      statusCode: 302,
      headers: { Location: WEB_URL },
    };
  }

  const token = await generaJwtToken(payload.email);

  const newUrl = new URL(WEB_URL);
  newUrl.search = new URLSearchParams({ token }).toString();

  return {
    statusCode: 302,
    headers: { Location: newUrl },
  };
};
