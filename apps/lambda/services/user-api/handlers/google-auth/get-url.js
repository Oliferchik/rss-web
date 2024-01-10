const googleSdk = require('./google-sdk');

module.exports.handler = async () => {
  const oAuthURL = googleSdk.getAuthURL();

  return {
    statusCode: 302,
    headers: { Location: oAuthURL },
  };
};
