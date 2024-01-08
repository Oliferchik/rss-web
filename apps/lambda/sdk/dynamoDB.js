const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');

const { REGION } = require('../constants');

const dynamoDB = class {
  constructor(TableName, dto) {
    this.TableName = TableName;
    this.client = new DynamoDBClient({ region: REGION });
    this.dto = dto;
  }

  async insert(item) {
    const params = {
      TableName: this.TableName,
      Item: this.dto.mapDataToDbData(item),
    };

    const command = new PutItemCommand(params);

    try {
      await this.client.send(command);

      console.info('Success - item added:', this.TableName);
    } catch (error) {
      console.error('Error during create rss in DB', error);
    }
  }

  async getAll() {
    const params = { TableName: this.TableName };
    const command = new ScanCommand(params);

    const { Items } = await this.client.send(command);

    const data = this.dto.mapArrayDbDataToData(Items);

    return data;
  }

  async findOne({ primaryKeyName, primaryKeyValue }) {
    const params = {
      TableName: this.TableName,
      Key: { [primaryKeyName]: primaryKeyValue },
    };

    const command = new GetItemCommand(params);

    const { Item } = await this.client.send(command);

    const data = this.dto.mapDbDataToData(Item);

    return data;
  }

  async find(fieldArray) {
    const params = {
      TableName: this.TableName,
      FilterExpression: fieldArray.map(({ fieldName }) => `${fieldName} = :${fieldName}`).join(' AND '),
      ExpressionAttributeValues: fieldArray.reduce((acc, { fieldName, fieldValue }) => ({ ...acc, [`:${fieldName}`]: fieldValue }), {}),
    };

    const command = new ScanCommand(params);
    const { Items } = await this.client.send(command);

    const data = this.dto.mapArrayDbDataToData(Items);

    return data;
  }

  async updateField(findQuery, { fieldName, fieldValue }) {
    const params = {
      TableName: this.TableName,
      Key: findQuery,
      UpdateExpression: `SET ${fieldName} = :newValue`,
      ExpressionAttributeValues: { ':newValue': fieldValue },
      ReturnValues: 'UPDATED_NEW',
    };

    const command = new UpdateItemCommand(params);

    try {
      await this.client.send(command);

      console.info('UpdateItem succeeded:');
    } catch (error) {
      console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
    }
  }
};

module.exports = dynamoDB;
