const RSS = require('rss');

const sdk = require('../../sdk');
const table = require('../../repository');

const initParserChannel = (telegramClient) => async (channelId, lastMessage) => {
  const [
    { total: totalMessages },
    channelInfo,
  ] = await Promise.all([
    telegramClient.getMessages(channelId, { limit: 1 }),
    telegramClient.getEntity(channelId),
  ]);

  if (totalMessages === lastMessage) {
    const messages = [];

    messages.total = totalMessages;

    return messages;
  }

  const limit = totalMessages - lastMessage;
  const messages = await telegramClient.getMessages(channelId, { limit });

  const messageInfo = messages
    .map((item) => ({
      title: channelInfo.title,
      description: item.message,
      url: sdk.telegram.getArticleUrl({ channelId, articleId: item.id }),
      guid: item.id,
      date: new Date(item.date),
    }))
    .sort((a, b) => a.date - b.date);

  messageInfo.total = totalMessages;

  return messageInfo;
};

const getRssFeed = async ({ userEmail, channelId }) => {
  const findQuery = [
    { fieldName: 'userEmail', fieldValue: { S: userEmail } },
    { fieldName: 'channelId', fieldValue: { S: channelId } },
  ];
  const [rssFeed] = await table.find(findQuery);

  return rssFeed;
};

const getChannelsInfo = async (channelId, lastMessageNumber) => {
  const client = await sdk.telegram.getTelegramClient();
  const parseChannel = initParserChannel(client);

  return parseChannel(channelId, lastMessageNumber);
};

const updateLastMessageCount = async (rssFeedUrl, lastMessageNumber) => {
  await table.updateField(
    { url: { S: rssFeedUrl } },
    { fieldName: 'lastMessage', fieldValue: { N: String(lastMessageNumber) } },
  );
};

const sync = async ({ userEmail, channelId }) => {
  try {
    const xmlString = await sdk.s3.getRssFile({ channelId, userEmail });
    const newFeed = new RSS({ generator: xmlString });

    const rssFeed = await getRssFeed({ userEmail, channelId });
    const newChannelInfo = await getChannelsInfo(channelId, rssFeed.lastMessage);

    newChannelInfo.forEach((articleInfo) => newFeed.item(articleInfo));

    const newXml = newFeed.xml({ indent: true });

    await sdk.s3.overwriteRssFile({ userEmail, channelId }, newXml);

    await updateLastMessageCount(rssFeed.url, newChannelInfo.total);
  } catch (err) {
    console.error(err);

    throw new Error('Error during update rss feed', err);
  }
};

module.exports = {
  sync,
};
