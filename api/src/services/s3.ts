import { DeleteObjectCommandInput, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

const generateFileKey = (file: UploadedFile): string =>

  `${Date.now().toString()}_${file.name}`;

const getFileKey = (filePath: string): string => {
  const filePathSplit = filePath.split('/');
  return filePathSplit[filePathSplit.length - 1];
}
export const s3Client: S3Client = new S3Client({
  forcePathStyle: false,
  endpoint: process.env.AWS_BUCKET_URL,
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.AWS_USER_KEY as string,
    secretAccessKey: process.env.AWS_SECRET as string,
  },
});

export const getUploadParams = (
  fileToUpload: UploadedFile
): PutObjectCommandInput => ({
  Bucket: process.env.AWS_BUCKET as string,
  Key: generateFileKey(fileToUpload),
  Body: fileToUpload.data,
  ACL: "public-read",
});

export const getDeleteParams = (
  filePath: string
): DeleteObjectCommandInput => ({
  Bucket: process.env.AWS_BUCKET as string,
  Key: getFileKey(filePath),
});