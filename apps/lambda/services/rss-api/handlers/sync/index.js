const service = require('./service');

module.exports.handler = async ({ email: userEmail, channelId }) => {
  try {
    await service.sync({ userEmail, channelId });

    return { statusCode: 200, body: {} };
  } catch (err) {
    const message = 'Sync rss error:';

    console.error(message, JSON.stringify(err, null, 2));
    const statusCode = err.statusCode || 404;

    return { statusCode, body: { error: message } };
  }
};
