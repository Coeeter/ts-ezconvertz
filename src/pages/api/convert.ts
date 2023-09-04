import convertVideos from '@/lib/convertVideos';
import Status from '@/models/Status';
import VideoData from '@/models/VideoData';
import { S3 } from 'aws-sdk';
import { existsSync, mkdirSync } from 'fs';
import { rm } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { v4 } from 'uuid';

const getTempDir = () => {
  const tempDir = process.env.IS_DEV
    ? path.join(process.cwd(), 'temp')
    : '/tmp';
  console.log(tempDir);
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir);
  }
  return tempDir;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST')
    return res.status(405).json({ message: 'Invalid method' });

  const session = v4();
  const outPutDir = path.join(getTempDir(), session);
  const zipPath = path.join(getTempDir(), `${session}.zip`);

  const { videos } = req.body;

  if (!videos || videos.length == 0) {
    return res.status(400).json({ message: 'Invalid videos' });
  }

  const videoDataList: VideoData[] = videos;
  if (
    videoDataList.some(data => {
      return (
        data.end == null || data.start == null || !data.name || !data.videoId
      );
    })
  ) {
    return res.status(400).json({ message: 'Invalid videos' });
  }

  const saveStatus = async (status: Status) => {
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    });

    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const uploadConfig = {
      Bucket: bucketName,
      Key: session,
      Body: Buffer.from(JSON.stringify({ status }), 'utf-8'),
      ContentType: 'application/json',
    };
    await s3.upload(uploadConfig).promise();
  };

  try {
    await saveStatus('pending');
    convertVideos(videoDataList, session, outPutDir, zipPath, saveStatus);
    if (res.headersSent) return;
    res.json({ session });
  } catch (e) {
    await saveStatus('error');
    console.log(e);
  } finally {
    if (existsSync(outPutDir)) {
      await rm(outPutDir, { recursive: true });
    }
    if (existsSync(zipPath)) {
      await rm(zipPath);
    }
  }
}
