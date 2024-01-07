const input = require('input');

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const DynamoDB = require('./dynamoDB.helpers');

const API_ID = 25845642;

const TABLE_NAME = 'telegram_clients';

const getTelegramClient = async () => {
  const sessionsTable = new DynamoDB(TABLE_NAME);
  const { Item: info } = await sessionsTable.get({ apiId: String(API_ID) });

  const stringSession = new StringSession(info.sessionKey);

  const client = new TelegramClient(stringSession, API_ID, info.apiHash);

  await client.connect();

  const isAuthorized = await client.isUserAuthorized();

  if (isAuthorized) {
    return client;
  }

  throw new Error('Telegram User is unAuthorized');
};

const updateSessionKey = async () => {
  const sessionsTable = new DynamoDB(TABLE_NAME);
  const { Item: info } = await sessionsTable.get({ apiId: String(API_ID) });

  const client = new TelegramClient(new StringSession(''), API_ID, info.apiHash);

  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.error(err),
  });

  console.info('You should now be connected.');
  const sessionKey = client.session.save();

  console.info('session key', sessionKey);

  await sessionsTable.updateField(
    { apiId: String(API_ID) },
    { fieldName: 'sessionKey', fieldValue: sessionKey },
  );
};

module.exports = {
  getTelegramClient,
  updateSessionKey,
};
