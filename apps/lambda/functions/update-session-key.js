const { updateSessionKey } = require('../helpers/telegram.helpers');

module.exports.handler = async () => {
  await updateSessionKey();

  return {
    statusCode: 200,
    body: {},
  };
};
