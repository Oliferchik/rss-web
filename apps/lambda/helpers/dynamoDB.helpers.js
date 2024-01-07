const AWS = require('aws-sdk');

const dynamoDB = class {
  constructor(TableName) {
    this.TableName = TableName;
    this.client = new AWS.DynamoDB.DocumentClient();
  }

  async getAll() {
    const { Items } = await this.client.scan({ TableName: this.TableName }).promise();

    return Items;
  }

  get(findQuery) {
    return this.client.get({
      TableName: this.TableName,
      Key: findQuery,
    }).promise();
  }

  updateField(findQuery, { fieldName, fieldValue }) {
    return this.client.update(
      {
        TableName: this.TableName,
        Key: findQuery,
        UpdateExpression: `SET ${fieldName} = :newValue`,
        ExpressionAttributeValues: { ':newValue': fieldValue },
        ReturnValues: 'UPDATED_NEW',
      },
      (err, data) => {
        if (err) {
          console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
          console.info('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        }
      },
    );
  }
};

module.exports = dynamoDB;
