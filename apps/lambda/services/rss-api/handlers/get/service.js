const DynamoDB = require('../../../../sdk/dynamoDB');
const { DB_TABLES } = require('../../../../constants');
const RssDto = require('../../dto/rss');

const getRssFeeds = async (userEmail) => {
  try {
    const rssTable = new DynamoDB(DB_TABLES.RSS, RssDto);
    const findQuery = [{ fieldName: 'userEmail', fieldValue: { S: userEmail } }];
    const rssFeeds = await rssTable.find(findQuery);

    return rssFeeds;
  } catch (err) {
    console.error(err);

    throw new Error('The rss feeds don`t exist', err);
  }
};

module.exports = {
  getRssFeeds,
};
