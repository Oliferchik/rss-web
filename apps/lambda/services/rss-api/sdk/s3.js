const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require('@aws-sdk/client-s3');
const { fromUtf8 } = require('@aws-sdk/util-utf8-node');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const RSS_BUCKET_NAME = 'my-hosted-rss-feeds';

const overwriteFile = async ({ bucketName, fileName, fileContent }) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fromUtf8(fileContent),
    ContentType: 'application/rss+xml',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  console.info(`File "${fileName}" overwritten successfully in bucket "${bucketName}".`);
};

const getFile = async ({ bucketName, fileName, contentType }) => {
  const params = { Bucket: bucketName, Key: fileName, ResponseContentType: contentType };

  const command = new GetObjectCommand(params);
  const data = await s3Client.send(command);

  return data.Body.toString('utf-8');
};

const generatePublicURL = async ({ bucketName, fileName, expirationTime }) => {
  const params = { Bucket: bucketName, Key: fileName };

  if (expirationTime) {
    params.Expires = expirationTime;
  }

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command);

    return url;
  } catch (err) {
    console.error('Error when creating RSS feed URL:', err);

    throw err;
  }
};

const createFile = async ({ bucketName, fileName, fileContent = '' }) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fromUtf8(fileContent),
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  console.info(`File '${fileName}' created in bucket '${bucketName}'`);

  return fileName;
};

const isBucketExists = async (bucketName) => {
  const params = { Bucket: bucketName };

  try {
    const command = new HeadBucketCommand(params);
    await s3Client.send(command);

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
    const command = new CreateBucketCommand(params);
    const data = await s3Client.send(command);

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
