const jwt = require('jsonwebtoken');

const AWS_REGION = 'eu-north-1';
const ACCOUNT_ID = '671661975001';
const API_ID = 's0vdhrv26f';

const VERSION = '2012-10-17';
const API_PERMISSIONS = [
  {
    // arn: `arn:aws:execute-api:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:${process.env.API_ID}`,
    arn: `arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}`,
    resource: 'rss',
    stage: 'dev',
    httpVerb: 'GET',
    scope: 'email',
  },
  {
    arn: `arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}`,
    resource: 'rss',
    stage: 'dev',
    httpVerb: 'POST',
    scope: 'email',
  },
  {
    arn: `arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}`,
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

// async function verifyAccessToken(accessToken) {
//   /*
//   * Verify the access token with your Identity Provider here (check if your
//   * Identity Provider provides an SDK).
//   *
//   * This example assumes this method returns a Promise that resolves to
//   * the decoded token, you may need to modify your code according to how
//   * your token is verified and what your Identity Provider returns.
//   *
//   * Fetch the KID attribute from your JWKS Endpoint to verify its integrity
//   * You can either use a Environment Variable containing the KID or call AWS Secrets Manager with KID already securely stored.
//   */
//   const data = await secretsmanager.getSecretValue({ SecretId: process.env.SM_JWKS_SECRET_NAME }).promise();
//   jwks = JSON.parse(data.SecretString);
//   kid = jwks.keys[0].kid;

//   const key = await client.getSigningKey(kid);
//   const signingKey = key.getPublicKey();
//   const decoded = jwt.verify(accessToken, signingKey);
//   return decoded;
// }

const decodeToken = async ({ authorizationToken }) => {
  const invalidTokenError = new Error('Invalid token');
  invalidTokenError.statusCode = 401;

  if (!authorizationToken) {
    console.error('Header with token doesn`t exist');

    throw invalidTokenError;
  }

  const token = authorizationToken.split(' ')[1];

  try {
    const data = await jwt.verify(token, process.env.SECRET_KEY);

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
