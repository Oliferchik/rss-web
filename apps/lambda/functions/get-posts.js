const AWS = require('aws-sdk');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const API_ID = 25845642;
const CHAT_ID = 'rebrykblog';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getTelegramClient = async () => {
  const params = { TableName: 'sessions', Key: { apiId: String(API_ID) } };
  const { Item: info } = await dynamoDB.get(params).promise();

  const stringSession = new StringSession(info.sessionKey);
  const client = new TelegramClient(stringSession, API_ID, info.apiHash);

  await client.connect();

  return client;
};

async function getMessageHistory() {
  try {
    const client = await getTelegramClient();

    const messages = await client.getMessages(CHAT_ID, { limit: 10 });

    console.log(messages);

    await client.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports.handler = async () => {
  await getMessageHistory();

  return {
    statusCode: 200,
    body: {},
  };
};
