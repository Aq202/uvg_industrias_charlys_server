import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import { awsBucketAccess, awsBucketSecret, bucketName } from '../../config/index.js';

const client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: awsBucketAccess,
    secretAccessKey: awsBucketSecret,
  },
});

const uploadFileToBucket = async (key, filePath, contentType) => {
  const fileBuffer = fs.readFileSync(filePath);

  const params = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    contentType,
  });

  return client.send(params);
};

export default uploadFileToBucket;
