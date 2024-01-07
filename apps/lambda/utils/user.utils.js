const DynamoDB = require('./dynamoDB.utils');

const getUserByEmail = async (email) => {
  const usersTable = new DynamoDB('users');

  const { Item } = await usersTable.get({ email });

  return Item;
};

module.exports = {
  getUserByEmail,
};
