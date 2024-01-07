const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const DynamoDB = require('../../../../utils/dynamoDB.utils');
const { DB_TABLES } = require('../../../../constants');

const RssDto = require('../../../../dto/rss.dto');

const invokeRssSync = async ({ email, channelId }) => {
  const lambdaClient = new LambdaClient();

  const invokeParams = {
    FunctionName: 'rss-feed-dev-rss-sync',
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

const getRssFeeds = async () => {
  const rssTable = new DynamoDB(DB_TABLES.RSS, RssDto);

  return rssTable.getAll();
};

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
