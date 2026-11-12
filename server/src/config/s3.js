const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.B2_BUCKET_NAME || 'calathx-media';

/**
 * Upload a file buffer to Backblaze B2 S3-compatible bucket.
 */
const uploadToB2 = async (buffer, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Construct public S3 URL
  const endpoint = process.env.B2_ENDPOINT.replace(/\/$/, '');
  return `${endpoint}/${BUCKET}/${key}`;
};

/**
 * Delete a file from Backblaze B2 bucket.
 */
const deleteFromB2 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3Client.send(command);
};

module.exports = { s3Client, uploadToB2, deleteFromB2, BUCKET };

