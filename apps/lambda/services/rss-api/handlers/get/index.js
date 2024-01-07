const service = require('./service');

module.exports.handler = async ({ email }) => {
  try {
    const rssFeeds = await service.getRssFeeds(email);

    return { statusCode: 200, body: rssFeeds };
  } catch (err) {
    const message = 'GET rss error';

    console.error(message, JSON.stringify(err, null, 2));
    const statusCode = err.statusCode || 404;

    return { statusCode, body: { error: message } };
  }
};
