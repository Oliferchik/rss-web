const jwt = require('jsonwebtoken');

const {
  AWS_REGION, AWS_ACCOUNT_ID, AWS_GATEWAY_ID, TOKEN_SECRET_KEY,
} = process.env;

const ARN = `arn:aws:execute-api:${AWS_REGION}:${AWS_ACCOUNT_ID}:${AWS_GATEWAY_ID}`;
const VERSION = '2012-10-17';
const API_PERMISSIONS = [
  {
    arn: ARN,
    resource: 'rss',
    stage: 'dev',
    httpVerb: 'GET',
    scope: 'email',
  },
  {
    arn: ARN,
    resource: 'rss',
    stage: 'dev',
    httpVerb: 'POST',
    scope: 'email',
  },
  {
    arn: ARN,
    resource: 'rss-sync',
    stage: 'dev',
    httpVerb: 'POST',
    scope: 'email',
  },
];

const DEFAULT_DENY_ALL_POLICY = {
  principalId: 'user',
  policyDocument: {
    Version: VERSION,
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: '*',
      },
    ],
  },
};

const decodeToken = async ({ authorizationToken }) => {
  const invalidTokenError = new Error('Invalid token');
  invalidTokenError.statusCode = 401;

  if (!authorizationToken) {
    console.error('Header with token doesn`t exist');

    throw invalidTokenError;
  }

  const token = authorizationToken.split(' ')[1];

  try {
    const data = await jwt.verify(token, TOKEN_SECRET_KEY);

    console.info('Decoded and Verified JWT Token', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Invalid token', error.message);

    throw invalidTokenError;
  }
};

const generatePolicy = (principalId, policyStatements) => {
  const authResponse = {
    principalId,
    policyDocument: {
      Version: VERSION,
      Statement: policyStatements,
    },
  };

  return authResponse;
};

const generatePolicyStatement = ({
  apiName, apiStage, apiVerb, apiResource, action,
}) => {
  const methodArn = `${apiName}/${apiStage}/${apiVerb}/${apiResource}`;

  return {
    Action: 'execute-api:Invoke',
    Effect: action,
    Resource: methodArn,

  };
};

const generateIAMPolicy = (scopeClaims) => {
  const policyStatements = API_PERMISSIONS.reduce((acc, permission) => {
    const isTokenScopesExists = scopeClaims.find((el) => el === permission.scope);
    if (!isTokenScopesExists) {
      return acc;
    }

    const apiPermission = {
      apiName: permission.arn,
      apiStage: permission.stage,
      apiVerb: permission.httpVerb,
      apiResource: permission.resource,
      action: 'Allow',
    };

    const newPermission = generatePolicyStatement(apiPermission);

    return [...acc, newPermission];
  }, []);

  return policyStatements.length === 0
    ? DEFAULT_DENY_ALL_POLICY
    : generatePolicy('user', policyStatements);
};

exports.handler = async (event) => {
  let email;

  try {
    const data = await decodeToken(event);
    email = data.email;
  } catch (err) {
    console.error(err);

    console.info('IAM Policy', JSON.stringify(DEFAULT_DENY_ALL_POLICY));

    return DEFAULT_DENY_ALL_POLICY;
  }

  const scopeClaims = ['email'];
  const iamPolicy = { ...generateIAMPolicy(scopeClaims), context: { email } };

  console.info('IAM Policy', JSON.stringify(iamPolicy));

  return iamPolicy;
};
