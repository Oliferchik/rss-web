const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-north-1' });

const s3 = new AWS.S3();

const RSS_BUCKET_NAME = 'my-hosted-rss-feeds';

const overwriteFile = async ({ bucketName, fileName, fileContent }) => {
  await s3.putObject({
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: 'application/rss+xml',
  }).promise();

  console.info(`File "${fileName}" overwrite successfully in bucket "${bucketName}".`);
};

const getFile = async ({ bucketName, fileName, contentType }) => {
  const getObjectParams = { Bucket: bucketName, Key: fileName, ResponseContentType: contentType };

  const data = await s3.getObject(getObjectParams).promise();

  return data.Body.toString('utf-8');
};

const generatePublicURL = async ({ bucketName, fileName, expirationTime }) => {
  const params = { Bucket: bucketName, Key: fileName };

  if (expirationTime) {
    params.Expires = expirationTime;
  }

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);

    return url;
  } catch (err) {
    console.error('Error when creating rss feed URL:', err);

    throw err;
  }
};

const createFile = async ({ bucketName, fileName, fileContent = '' }) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  };

  await s3.putObject(params).promise();

  console.info(`File '${fileName}' created in bucket '${bucketName}'`);

  return fileName;
};

const isBucketExists = async (bucketName) => {
  const params = { Bucket: bucketName };

  try {
    await s3.headBucket(params).promise();

    console.info('Bucket exists:', bucketName);

    return true;
  } catch (err) {
    console.error("Bucket does not exist or you don't have access:", err);

    return false;
  }
};

const createBucket = async (bucketName) => {
  const isExists = await isBucketExists(bucketName);

  if (isExists) {
    return bucketName;
  }

  const params = { Bucket: bucketName };

  try {
    const data = await s3.createBucket(params).promise();

    console.info('Bucket created successfully:', data.Location);
  } catch (err) {
    console.error('Error creating bucket:', err);
  }

  return bucketName;
};

const getRssPathToFile = (userEmail) => {
  const [email] = userEmail.split('@');

  return email;
};

const getRssFileName = ({ userEmail, channelId }) => {
  const path = getRssPathToFile(userEmail);

  return `${path}/${channelId}.xml`;
};

const createRssFile = async ({ channelId, userEmail }) => {
  const fileName = getRssFileName({ userEmail, channelId });

  return createFile({ fileName, bucketName: RSS_BUCKET_NAME });
};

const overwriteRssFile = async ({ userEmail, channelId }, fileContent) => {
  const fileName = getRssFileName({ userEmail, channelId });

  return overwriteFile({ bucketName: RSS_BUCKET_NAME, fileName, fileContent });
};

const getRssFile = async ({ channelId, userEmail }) => {
  const fileName = getRssFileName({ channelId, userEmail });

  return getFile({ bucketName: RSS_BUCKET_NAME, fileName, contentType: 'application/rss+xml' });
};

// eslint-disable-next-line max-len
const generateRssPublicURL = async (fileName) => generatePublicURL({ bucketName: RSS_BUCKET_NAME, fileName });

module.exports = {
  createBucket,
  getFile,
  createFile,
  generatePublicURL,
  overwriteFile,

  createRssFile,
  overwriteRssFile,
  generateRssPublicURL,
  getRssFile,
};
