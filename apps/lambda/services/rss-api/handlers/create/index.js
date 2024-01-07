const service = require('./service');

module.exports.handler = async ({ email, channelId }) => {
  try {
    const rssFeed = await service.getRssFeed({ email, channelId });

    if (rssFeed) {
      return { statusCode: 200, body: rssFeed };
    }

    const data = await service.create({ email, channelId });

    return { statusCode: 200, body: data };
  } catch (err) {
    const message = 'CREATE rss error';

    console.error(message, JSON.stringify(err, null, 2));
    const statusCode = err.statusCode || 404;

    return { statusCode, body: { error: message } };
  }
};
