const service = require('./service');

module.exports.handler = async () => {
  try {
    await service.sync();

    return {
      statusCode: 200,
      body: 'Invocation successful!',
    };
  } catch (err) {
    const message = 'Error invoking rss Lambda job function';

    console.error(message, JSON.stringify(err, null, 2));

    return {
      statusCode: 500,
      body: message,
    };
  }
};
