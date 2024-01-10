const DynamoDB = require('./sdk/dynamoDB');
const RssDto = require('./dto/rss');

const TABLE_NAME = 'rss';

const table = new DynamoDB(TABLE_NAME, RssDto);

module.exports = table;
