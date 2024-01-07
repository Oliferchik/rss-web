const { updateSessionKey } = require('../../sdk/telegram.sdk');

module.exports.handler = async () => {
  try {
    await updateSessionKey();

    return {
      statusCode: 200,
      body: {},
    };
  } catch (err) {
    const message = 'UPDATE session key error';

    console.error(message, JSON.stringify(err, null, 2));
    const statusCode = err.statusCode || 404;

    return { statusCode, body: { error: message } };
  }
};
