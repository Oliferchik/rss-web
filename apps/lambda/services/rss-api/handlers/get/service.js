const table = require('../../repository');

const getRssFeeds = async (userEmail) => {
  try {
    const findQuery = [{ fieldName: 'userEmail', fieldValue: { S: userEmail } }];
    const rssFeeds = await table.find(findQuery);

    return rssFeeds;
  } catch (err) {
    console.error(err);

    throw new Error('The rss feeds don`t exist', err);
  }
};

module.exports = {
  getRssFeeds,
};
