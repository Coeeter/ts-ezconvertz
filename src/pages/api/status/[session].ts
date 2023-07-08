import { S3 } from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import Status from '@/models/Status';

const getStatusFromS3 = async (
  session: string
): Promise<Status | undefined> => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const downloadConfig = {
    Bucket: bucketName,
    Key: session,
  };
  const { Body } = await s3.getObject(downloadConfig).promise();
  if (!Body) return;
  return JSON.parse(Body.toString());
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end();
  const { session } = req.query;
  if (!session || typeof session != 'string') return res.status(400).end();
  const status = await getStatusFromS3(session);
  if (!status) return res.status(404).end();
  return res.status(200).json(status);
}
