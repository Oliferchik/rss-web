const RSS = require('rss');

const sdk = require('../../sdk');
const table = require('../../repository');

const initRssFeed = async ({ userEmail, channelId }) => {
  const fileName = await sdk.s3.createRssFile({ userEmail, channelId });
  const url = await sdk.s3.generateRssPublicURL(fileName);

  const feed = new RSS({
    title: `Telegram channel(${channelId} rss feed`,
    description: `Aggregation of articles from ${channelId} telegram channel`,
    feed_url: url,
    site_url: sdk.telegram.getChannelUrl(channelId),
    language: 'en',
  });

  const xml = feed.xml({ indent: true });

  await sdk.s3.overwriteRssFile({ userEmail, channelId }, xml);

  return url;
};

const create = async ({ channelId, email: userEmail }) => {
  try {
    const client = await sdk.telegram.getTelegramClient();
    const [messages, url] = await Promise.all([
      client.getMessages(channelId, { limit: 1 }),
      initRssFeed({ userEmail, channelId }),
    ]);

    const payload = {
      url,
      channelId,
      lastMessage: messages.total,
      userEmail,
    };
    await table.insert(payload);

    return payload;
  } catch (err) {
    console.error(err);

    throw new Error('Error during creation rss feed', err);
  }
};

const getRssFeed = async ({ channelId, email: userEmail }) => {
  const findQuery = [
    { fieldName: 'userEmail', fieldValue: { S: userEmail } },
    { fieldName: 'channelId', fieldValue: { S: channelId } },

  ];
  const [rssFeed] = await table.find(findQuery);

  return rssFeed;
};

module.exports = {
  create,
  getRssFeed,
};
