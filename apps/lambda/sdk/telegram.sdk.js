const input = require('input');

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const DynamoDB = require('../utils/dynamoDB.utils');
const TelegramDto = require('../dto/telegram_client.dto');

const { DB_TABLES } = require('../constants');

const API_ID = 25845642;

const getArticleUrl = ({ channelId, articleId }) => `https://t.me/${channelId}/${articleId}`;
const getChannelUrl = (channelId) => `https://t.me/${channelId}`;

const getTelegramClient = async () => {
  const telegramClientsTable = new DynamoDB(DB_TABLES.TELEGRAM_CLIENTS, TelegramDto);
  const telegramClient = await telegramClientsTable.findOne({
    primaryKeyName: 'apiId',
    primaryKeyValue: { S: String(API_ID) },
  });
  const stringSession = new StringSession(telegramClient.sessionKey);

  const client = new TelegramClient(stringSession, API_ID, telegramClient.apiHash);
  await client.connect();

  const isAuthorized = await client.isUserAuthorized();
  if (isAuthorized) {
    return client;
  }

  throw new Error('Telegram User is unAuthorized');
};

const updateSessionKey = async () => {
  const telegramClientsTable = new DynamoDB(DB_TABLES.TELEGRAM_CLIENTS, TelegramDto);
  const telegramClient = await telegramClientsTable.findOne({
    primaryKeyName: 'apiId',
    primaryKeyValue: { S: String(API_ID) },
  });

  const client = new TelegramClient(new StringSession(''), API_ID, telegramClient.apiHash);
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.error(err),
  });

  console.info('You should now be connected.');
  const sessionKey = client.session.save();

  console.info('session key', sessionKey);

  await telegramClientsTable.updateField(
    { apiId: { S: String(API_ID) } },
    { fieldName: 'sessionKey', fieldValue: { S: sessionKey } },
  );
};

module.exports = {
  getTelegramClient,
  updateSessionKey,
  getChannelUrl,
  getArticleUrl,
};
