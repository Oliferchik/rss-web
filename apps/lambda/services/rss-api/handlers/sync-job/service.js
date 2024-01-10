const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const table = require('../../repository');

const RSS_SYNC_FUNCTION_NAME = 'rss-feed-dev-rss-sync';

const invokeRssSync = async ({ email, channelId }) => {
  const lambdaClient = new LambdaClient();

  const invokeParams = {
    FunctionName: RSS_SYNC_FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify({ email, channelId }),
  };

  try {
    const command = new InvokeCommand(invokeParams);

    await lambdaClient.send(command);
  } catch (err) {
    const message = `Error invoking rss Lambda job function for: email=${email} channelId={channelId}`;

    console.error(message, JSON.stringify(err, null, 2));
  }
};

const getRssFeeds = async () => table.getAll();

const sync = async () => {
  const rssFeeds = await getRssFeeds();

  await Promise.all(
    rssFeeds.map(
      (rssFeed) => invokeRssSync({ email: rssFeed.userEmail, channelId: rssFeed.channelId }),
    ),
  );
};

module.exports = {
  sync,
};
