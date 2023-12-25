const RSS = require('rss');

const { getTelegramClient } = require('../helpers/telegram.helpers');
const s3Helpers = require('../helpers/s3.helpers');
const DynamoDB = require('../helpers/dynamoDB.helpers');

const initRssFeed = async (user) => {
  const fileName = await s3Helpers.createRssFile(user, '');
  const url = await s3Helpers.generatePublicURL(fileName);

  const feed = new RSS({
    title: 'Telegram rss feed',
    description: 'aggregation of articles from public telegram channels',
    feed_url: url,
    site_url: url,
    language: 'en',
  });

  const xml = feed.xml({ indent: true });

  await s3Helpers.overwriteFile(user, xml);

  return url;
};

const initParserChannel = (telegramClient) => async (channelName, lastMessage) => {
  const [
    { total: totalMessages },
    channelInfo,
  ] = await Promise.all([
    telegramClient.getMessages(channelName, { limit: 1 }),
    telegramClient.getEntity(channelName),
  ]);

  if (totalMessages === lastMessage) {
    const messages = [];

    messages.total = totalMessages;

    return messages;
  }

  const limit = totalMessages - lastMessage;
  const messages = await telegramClient.getMessages(channelName, { limit });

  const messageInfo = messages.map((item) => ({
    title: channelInfo.title,
    description: item.message,
    url: `https://t.me/${channelName}/${item.id}`,
    guid: item.id,
    date: new Date(item.date),
  }));

  messageInfo.total = totalMessages;

  return messageInfo;
};

const getChannelsInfo = async (user) => {
  const { chanelToLastMessage } = user;
  const client = await getTelegramClient();
  const parseChannel = initParserChannel(client);

  const channelsInfo = {};
  await Promise.all(
    Object.keys(chanelToLastMessage)
      .map(async (channelName) => {
        const articles = await parseChannel(channelName, chanelToLastMessage[channelName]);

        channelsInfo[channelName] = { data: articles, total: articles.total };
      }),
  );

  return channelsInfo;
};

const modifyRssFeed = async (user) => {
  const xmlString = await s3Helpers.getRssFile(user);
  const feed = new RSS({ generator: xmlString });

  const channelsInfo = await getChannelsInfo(user);
  const channelsArticles = Object.keys(channelsInfo)
    .reduce((acc, channelName) => {
      const { data } = channelsInfo[channelName];

      return [...acc, ...data];
    }, []);

  channelsArticles
    .sort((a, b) => a.date - b.date)
    .forEach((articleInfo) => feed.item(articleInfo));

  const newXml = feed.xml({ indent: true });

  await s3Helpers.overwriteFile(user, newXml);

  return channelsInfo;
};

const init = async (user) => {
  const rssFeedUrl = await initRssFeed(user);

  const userTable = new DynamoDB('users');

  await userTable.updateField({ email: user.email }, { fieldName: 'rssFeedUrl', fieldValue: rssFeedUrl });
};

const updateLastMessageCount = async (user, modifiedDate) => {
  const newChannelToLastMessages = Object.keys(modifiedDate)
    .reduce((acc, channelName) => {
      acc[channelName] = modifiedDate[channelName].total;

      return acc;
    }, {});

  const userTable = new DynamoDB('users');

  await userTable.updateField(
    { email: user.email },
    { fieldName: 'chanelToLastMessage', fieldValue: newChannelToLastMessages },
  );
};

const updateUserRss = async (user) => {
  if (!user.rssFeedUrl) {
    await init(user);
  }

  const modifiedDate = await modifyRssFeed(user);

  await updateLastMessageCount(user, modifiedDate);
};

module.exports.handler = async () => {
  const usersTable = new DynamoDB('users');

  const users = await usersTable.getAll();

  await Promise.all(users.map((user) => updateUserRss(user)));

  return {
    statusCode: 200,
    body: {},
  };
};
