import VideoData from '@/models/VideoData';
import { S3 } from 'aws-sdk';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync } from 'fs';
import { mkdir, readFile, rm } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { v4 } from 'uuid';
import ytdl from 'ytdl-core';
import { zip } from 'zip-a-folder';

const getTempDir = () => {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir);
  }
  return tempDir;
};

const streamAndClipAudio = async (
  url: string,
  outPutFilePath: string,
  start: number,
  end: number
) => {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(url, { filter: 'audioonly' });
    ffmpeg(audioStream)
      .setStartTime(start)
      .setDuration(end - start)
      .audioBitrate(128)
      .format('mp3')
      .output(outPutFilePath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};

const uploadFileToS3 = async (
  session: string,
  blob: Buffer,
  contentType: 'application/zip' | 'application/json' = 'application/zip'
) => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const uploadConfig = {
    Bucket: bucketName,
    Key: session,
    Body: blob,
    ContentType: contentType,
  };
  return await s3.upload(uploadConfig).promise();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST')
    return res.status(405).json({ message: 'Invalid method' });
  const session = v4();
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
  const outPutDir = path.join(getTempDir(), session);
  await mkdir(outPutDir, { recursive: true });
  const conversions = videoDataList.map(async videoData => {
    try {
      await streamAndClipAudio(
        `https://youtube.com/watch?v=${videoData.videoId}`,
        path.join(outPutDir, `${videoData.name}.mp3`),
        videoData.start,
        videoData.end
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
  const zipPath = path.join(getTempDir(), `${session}.zip`);
  try {
    await Promise.all([
      uploadFileToS3(
        `requests/${session}.json`,
        Buffer.from(JSON.stringify(videoDataList, null, 2), 'utf-8'),
        'application/json'
      ),
      ...conversions,
    ]);
    await zip(outPutDir, zipPath);
    await uploadFileToS3(
      `${session}.zip`,
      await readFile(zipPath),
      'application/zip'
    );
    if (res.headersSent) return;
    res.json({ session });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  } finally {
    await rm(outPutDir, { recursive: true });
    if (existsSync(zipPath)) {
      await rm(zipPath);
    }
  }
}
