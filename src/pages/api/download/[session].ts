import { S3 } from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME!;

const getFileReadStreamFromS3 = (session: string) => {
  const downloadConfig = {
    Bucket: bucketName,
    Key: session,
  };
  const readStream = s3.getObject(downloadConfig).createReadStream();
  return readStream;
};

export const deleteFileFromS3 = async (session: string) => {
  const deleteConfig = {
    Bucket: bucketName,
    Key: session,
  };
  return await s3.deleteObject(deleteConfig).promise();
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET')
    return res.status(405).json({ message: 'Invalid method' });
  try {
    const { session } = req.query;
    const fileName = `${session}.zip`;
    const readSteam = getFileReadStreamFromS3(fileName);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/zip');
    readSteam.pipe(res);
    readSteam.on('end', async () => {
      await deleteFileFromS3(fileName);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
