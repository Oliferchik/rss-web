const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const generaJwtToken = () => {
  const secretKey = process.env.SECRET_KEY;
  const options = { expiresIn: '1h' };

  
  return jwt.sign({}, secretKey, options);
};

const isPasswordValid = async ({email, password}) => {
  const params = {
    TableName: 'users',
    Key: { email }
  };

  const {Item: data} = await dynamoDB.get(params).promise();

  if (data?.password === password) {
    return true
  }

  return false
};

const errorBody = { statusCode: 401, body: {} }

module.exports.handler = async (event) => {
  if(!event?.body) {
    return errorBody
  }

  const requestBody = JSON.parse(event.body);
  const { email, password } = requestBody || {};
  
  const isValid = await isPasswordValid({email, password});

  if(!isValid) {
    return errorBody;
  }

  const body = { message: generaJwtToken() }

  return {
    statusCode: 200,
    body: JSON.stringify(body, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
      'Access-Control-Allow-Methods': "POST, OPTIONS, GET, PUT"
  },
  };
};
