const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-north-1' });

const s3 = new AWS.S3();

const bucketName = 'my-hosted-rss-feeds';

const getFileName = (user) => {
  const [email] = user.email.split('@');

  return `${email}.xml`;
};

const overwriteFile = async (user, fileData) => {
  const fileName = getFileName(user);

  await s3.putObject({
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
    ContentType: 'application/rss+xml',
  }).promise();

  console.info(`File "${fileName}" in bucket "${bucketName}" updated successfully.`);
};

const getRssFile = async (user) => {
  const fileName = getFileName(user);

  const getObjectParams = { Bucket: bucketName, Key: fileName, ResponseContentType: 'application/rss+xml' };

  const data = await s3.getObject(getObjectParams).promise();

  return data.Body.toString('utf-8');
};

const generatePublicURL = async (fileName, expirationTime) => {
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

const createRssFile = async (user, fileContent) => {
  const fileName = getFileName(user);

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
  };

  await s3.putObject(params).promise();

  console.info(`File '${fileName}' created in bucket '${bucketName}'`);

  return fileName;
};

module.exports = {
  getRssFile,
  createRssFile,
  generatePublicURL,
  overwriteFile,
};
