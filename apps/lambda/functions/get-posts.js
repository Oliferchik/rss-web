const CHAT_ID = 'rebrykblog';

const { getTelegramClient } = require('../helpers/telegram.helpers');

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
