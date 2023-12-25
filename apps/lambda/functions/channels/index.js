const { getUserByEmail } = require('../../helpers/user.helpers');
const { decodeToken } = require('../../helpers/token.helpers');

const { HTTP_METHODS } = require('../../constants');

const getChannels = require('./get');
const addChannel = require('./add');

const getBody = (req) => {
  const method = req?.requestContext?.http?.method;

  switch (method) {
    case HTTP_METHODS.GET:
      return getChannels(req);

    case HTTP_METHODS.POST:
      return addChannel(req);

    default:
      throw new Error(`Unsupported http method: ${method}`);
  }
};

const tryToAttachUser = async (req) => {
  const { email } = await decodeToken(req);
  const user = await getUserByEmail(email);

  req.state = { user };
};

const handler = async (req) => {
  await tryToAttachUser(req);

  const body = await getBody(req);

  return { body };
};

module.exports.handler = async (req) => {
  try {
    const { body } = await handler(req);

    return { statusCode: 200, body };
  } catch (err) {
    const method = req?.requestContext?.http?.method;
    console.error(`${method} channels error:`, JSON.stringify(err, null, 2));
    const statusCode = err.statusCode || 404;

    return { statusCode, body: { error: err.message } };
  }
};
