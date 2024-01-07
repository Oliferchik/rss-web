const jwt = require('jsonwebtoken');

const DynamoDB = require('../../../utils/dynamoDB.utils');
const { DB_TABLES } = require('../../../constants');
const UserDto = require('../../../dto/user.dto');

const generaJwtToken = async (email) => {
  const secretKey = process.env.SECRET_KEY;
  const options = { expiresIn: '1h' };

  return jwt.sign({ email }, secretKey, options);
};

const isPasswordValid = async ({ email, password }) => {
  const userTable = new DynamoDB(DB_TABLES.USERS, UserDto);
  const findQuery = { primaryKeyName: 'email', primaryKeyValue: { S: email } };
  const user = await userTable.findOne(findQuery);

  if (user?.password === password) {
    return true;
  }

  return false;
};

const errorBody = {
  statusCode: 401,
  body: {
    errors: { credentials: 'The email or password you have entered is invalid' },
  },
};

module.exports.handler = async ({ email, password }) => {
  if (!email || !password) {
    return errorBody;
  }

  const isValid = await isPasswordValid({ email, password });

  if (!isValid) {
    return errorBody;
  }

  const token = await generaJwtToken(email);

  return {
    statusCode: 200,
    body: { token },
  };
};
