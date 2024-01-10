const { OAuth2Client } = require('google-auth-library');

const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AWS_GATEWAY_ID, AWS_REGION,
} = process.env;

const WEBHOOK_URL = `https://${AWS_GATEWAY_ID}.execute-api.${AWS_REGION}.amazonaws.com/dev/users/auth-google/webhook`;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  WEBHOOK_URL,
);

const getAuthURL = () => client.generateAuthUrl({
  access_type: 'offline',
  scope: ['email', 'profile'],
  include_granted_scopes: true,
});

const exchangeCodeForToken = async (code) => {
  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token || '',
      audience: GOOGLE_CLIENT_ID,
    });

    return {
      isValid: true,
      payload: ticket.getPayload(),
    };
  } catch ({ message, ...rest }) {
    return {
      isValid: false,
      payload: { message },
    };
  }
};

module.exports = {
  getAuthURL,
  exchangeCodeForToken,
};
