const { getTelegramClient } = require('../../helpers/telegram.helpers');
const DynamoDB = require('../../helpers/dynamoDB.helpers');

const create = async (req) => {
  const { user } = req.state;

  const body = JSON.parse(req.body);

  try {
    const client = await getTelegramClient();

    const messages = await client.getMessages(body.channelId, { limit: 1 });

    const usersTable = new DynamoDB('users');
    await usersTable.updateField(
      { email: user.email },
      { fieldName: `chanelToLastMessage.${body.channelId}`, fieldValue: messages.total },
    );
  } catch (err) {
    console.error(err);

    throw new Error('The channel doesn`t exist ');
  }
};

module.exports = create;
