import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream, createWriteStream } from 'fs';
import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { v4 } from 'uuid';
import ytdl from 'ytdl-core';
import { zip } from 'zip-a-folder';

class ConverterController {
  getDataOfVideo = async (req: Request, res: Response) => {
    const { videoId } = req.body;
    await writeFile(
      path.join(__dirname, '..', '..', 'requests', `${videoId}.json`),
      JSON.stringify({ videoId }, null, 2)
    );
    if (!videoId || videoId.length == 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid videoId' });
    try {
      const video = await ytdl.getInfo(videoId);
      const lastPic = video.videoDetails.thumbnails.length - 1;
      res.json({
        name: video.videoDetails.title,
        length: video.videoDetails.lengthSeconds,
        thumbnail: video.videoDetails.thumbnails[lastPic].url,
      });
    } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: e,
      });
    }
  };

  convertAndDownloadAudioAsZip = async (req: Request, res: Response) => {
    const session = v4();
    console.log(`session: ${session}`);
    const { videos } = req.body;
    if (!videos || videos.length == 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid videos' });
    const videoDataList: VideoData[] = videos;
    if (
      videoDataList.some(
        data =>
          data.end == null || data.start == null || !data.name || !data.videoId
      )
    )
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid videos' });
    await writeFile(
      path.join(__dirname, '..', '..', 'requests', `${session}.json`),
      JSON.stringify(videoDataList, null, 2)
    );
    const outputPath = path.join(__dirname, '..', '..', 'downloads', session);
    await mkdir(outputPath, { recursive: true });
    const conversions = videoDataList.map(async videoData => {
      try {
        const url = `https://youtube.com/watch?v=${videoData.videoId}`;
        const outputFilePath = path.join(
          outputPath,
          `unclipped_${videoData.name}.mp3`
        );
        const clippedOutputFilePath = path.join(
          outputPath,
          `${videoData.name}.mp3`
        );
        await new Promise(async (resolve, reject) => {
          try {
            const info = await ytdl.getInfo(url);
            const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
            const audioStream = ytdl.downloadFromInfo(info, {
              format: audioFormats[0],
            });
            audioStream.pipe(createWriteStream(outputFilePath, { flags: 'w' }));
            audioStream.on('end', resolve);
          } catch (e) {
            reject(e);
          }
        });
        await new Promise((resolve, reject) => {
          ffmpeg(outputFilePath)
            .setStartTime(videoData.start)
            .setDuration(videoData.end - videoData.start)
            .audioBitrate(128)
            .output(clippedOutputFilePath)
            .on('end', resolve)
            .on('error', reject)
            .run();
        });
        await unlink(outputFilePath);
      } catch (e) {
        console.log(e);
        throw e;
      }
    });
    try {
      await Promise.all(conversions);
      const zipPath = path.join(outputPath, '..', `${session}.zip`);
      await zip(outputPath, zipPath);
      await rm(outputPath, { recursive: true });
      if (res.headersSent) return;
      res.json({ session });
    } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
    }
  };

  downloadZip = async (req: Request, res: Response) => {
    try {
      const { session } = req.params;
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'downloads',
        `${session}.zip`
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${session}.zip`
      );
      res.setHeader('Content-Type', 'application/zip');
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
      fileStream.on('end', async () => {
        await unlink(filePath);
      });
    } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
    }
  };
}

export default ConverterController;
