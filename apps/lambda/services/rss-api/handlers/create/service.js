const RSS = require('rss');

const DynamoDB = require('../../../../utils/dynamoDB.utils');

const telegramSdk = require('../../../../sdk/telegram.sdk');
const s3Sdk = require('../../../../sdk/s3.sdk');

const { DB_TABLES } = require('../../../../constants');
const RssDto = require('../../../../dto/rss.dto');

const initRssFeed = async ({ userEmail, channelId }) => {
  const fileName = await s3Sdk.createRssFile({ userEmail, channelId });
  const url = await s3Sdk.generateRssPublicURL(fileName);

  const feed = new RSS({
    title: `Telegram channel(${channelId} rss feed`,
    description: `Aggregation of articles from ${channelId} telegram channel`,
    feed_url: url,
    site_url: telegramSdk.getChannelUrl(channelId),
    language: 'en',
  });

  const xml = feed.xml({ indent: true });

  await s3Sdk.overwriteRssFile({ userEmail, channelId }, xml);

  return url;
};

const create = async ({ channelId, email: userEmail }) => {
  try {
    const client = await telegramSdk.getTelegramClient();
    const [messages, url] = await Promise.all([
      client.getMessages(channelId, { limit: 1 }),
      initRssFeed({ userEmail, channelId }),
    ]);

    const rssTable = new DynamoDB(DB_TABLES.RSS, RssDto);
    const payload = {
      url,
      channelId,
      lastMessage: messages.total,
      userEmail,
    };
    await rssTable.insert(payload);

    return payload;
  } catch (err) {
    console.error(err);

    throw new Error('Error during creation rss feed', err);
  }
};

const getRssFeed = async ({ channelId, email: userEmail }) => {
  const rssTable = new DynamoDB(DB_TABLES.RSS, RssDto);
  const findQuery = [
    { fieldName: 'userEmail', fieldValue: { S: userEmail } },
    { fieldName: 'channelId', fieldValue: { S: channelId } },

  ];
  const [rssFeed] = await rssTable.find(findQuery);

  return rssFeed;
};

module.exports = {
  create,
  getRssFeed,
};
