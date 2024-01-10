const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION_KEY } = process.env;

const getArticleUrl = ({ channelId, articleId }) => `https://t.me/${channelId}/${articleId}`;
const getChannelUrl = (channelId) => `https://t.me/${channelId}`;

const getTelegramClient = async () => {
  const stringSession = new StringSession(TELEGRAM_SESSION_KEY);
  const client = new TelegramClient(stringSession, TELEGRAM_API_ID, TELEGRAM_API_HASH);
  await client.connect();

  const isAuthorized = await client.isUserAuthorized();
  if (isAuthorized) {
    return client;
  }

  throw new Error('Telegram User is unAuthorized');
};

module.exports = {
  getTelegramClient,
  getChannelUrl,
  getArticleUrl,
};
