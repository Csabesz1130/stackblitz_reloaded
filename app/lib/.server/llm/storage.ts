import { Storage } from '@google-cloud/storage';
import { S3 } from 'aws-sdk/clients/s3';

const googleCloudStorage = new Storage();
const s3 = new S3();

export async function uploadToGoogleCloud(bucketName: string, filePath: string, destination: string) {
  await googleCloudStorage.bucket(bucketName).upload(filePath, {
    destination,
  });
}

export async function uploadToS3(bucketName: string, filePath: string, destination: string) {
  const params = {
    Bucket: bucketName,
    Key: destination,
    Body: require('fs').createReadStream(filePath),
  };

  await s3.upload(params).promise();
}

export async function downloadFromGoogleCloud(bucketName: string, srcFilename: string, destFilename: string) {
  const options = {
    destination: destFilename,
  };

  await googleCloudStorage.bucket(bucketName).file(srcFilename).download(options);
}

export async function downloadFromS3(bucketName: string, srcFilename: string, destFilename: string) {
  const params = {
    Bucket: bucketName,
    Key: srcFilename,
  };

  const data = await s3.getObject(params).promise();
  require('fs').writeFileSync(destFilename, data.Body as Buffer);
}
