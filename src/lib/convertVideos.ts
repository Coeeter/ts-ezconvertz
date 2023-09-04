import VideoData from '@/models/VideoData';
import { mkdir, readFile, rm } from 'fs/promises';
import ytdl from 'ytdl-core';
import { S3 } from 'aws-sdk';
import path from 'path';
import { zip } from 'zip-a-folder';
import Status from '@/models/Status';
import ffmpegstatic from 'ffmpeg-static';
import Ffmpeg from 'fluent-ffmpeg';
import NodeID3 from 'node-id3';
import axios from 'axios';

const streamAndClipAudio = async (
  url: string,
  outPutFilePath: string,
  title: string,
  artist: string,
  start: number,
  end: number
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ytdl.getBasicInfo(url);
      const bitrate =
        data.formats
          .map(f => f.audioBitrate)
          .filter(f => !!f)
          .sort((a, b) => b! - a!)[0] || 128;
      const audioStream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highest',
      });
      Ffmpeg.setFfmpegPath(ffmpegstatic!);
      Ffmpeg(audioStream)
        .setStartTime(start)
        .setDuration(end - start)
        .audioBitrate(bitrate)
        .format('mp3')
        .output(outPutFilePath)
        .on('end', async () => {
          const arrayBuffer = await axios.get(
            data.videoDetails.thumbnails[
              data.videoDetails.thumbnails.length - 1
            ].url,
            {
              responseType: 'arraybuffer',
            }
          );
          const buffer = Buffer.from(arrayBuffer.data);
          const success = NodeID3.write(
            {
              title,
              artist,
              image: {
                imageBuffer: buffer,
                mime: 'image/png',
                type: {
                  id: 3,
                },
                description: 'cover',
              },
            },
            outPutFilePath
          );
          if (!success) {
            return reject('Failed to write metadata');
          }
          resolve(outPutFilePath);
        })
        .on('error', reject)
        .run();
    } catch (e) {
      reject(e);
    }
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

const convertVideos = async (
  videos: VideoData[],
  session: string,
  outPutDir: string,
  zipPath: string,
  saveStatus: (status: Status) => Promise<void>
) => {
  await saveStatus('processing');
  await mkdir(outPutDir, { recursive: true });
  const conversions = videos.map(async videoData => {
    try {
      await streamAndClipAudio(
        `https://youtube.com/watch?v=${videoData.videoId}`,
        path.join(outPutDir, `${videoData.name}.mp3`),
        videoData.name,
        videoData.artist,
        videoData.start,
        videoData.end
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
  await Promise.all([
    uploadFileToS3(
      `requests/${session}.json`,
      Buffer.from(JSON.stringify(videos, null, 2), 'utf-8'),
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
  await Promise.all([
    rm(outPutDir, { recursive: true }),
    rm(zipPath),
    saveStatus('done'),
  ]);
};

export default convertVideos;
