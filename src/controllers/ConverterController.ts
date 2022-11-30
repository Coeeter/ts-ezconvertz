import { Request, Response } from 'express';
import { rm, unlink } from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { v4 } from 'uuid';
import { zip } from 'zip-a-folder';
import runPythonScript from '../utils/runPythonScript';

class ConverterController {
  getDataOfVideo = async (req: Request, res: Response) => {
    const { videoId } = req.body;
    if (!videoId || videoId.length == 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid videoId' });
    try {
      const [result] = await runPythonScript('scripts/get-data.py', {
        mode: 'text',
        args: [videoId],
      });
      res.json(JSON.parse(result));
    } catch (e) {
      console.log(e);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: e,
      });
    }
  };

  convertAndDownloadAudioAsZip = (req: Request, res: Response) => {
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
    let finished: string[] = [];
    videoDataList.forEach(async videoData => {
      try {
        const args = {
          session,
          ...videoData,
        };
        await runPythonScript('scripts/converter.py', {
          mode: 'text',
          args: [JSON.stringify(args)],
        });
        const folderPath = path.join(
          __dirname,
          '..',
          '..',
          'downloads',
          session
        );
        const filePath = path.join(folderPath, `${videoData.name}.mp3`);
        finished = [...new Set([...finished, filePath])];
        if (finished.length !== videoDataList.length) return;
        const zipPath = path.join(folderPath, '..', `${session}.zip`);
        await zip(folderPath, zipPath);
        if (res.headersSent) return;
        res.download(zipPath, async () => {
          await rm(folderPath, { recursive: true });
          await unlink(zipPath);
        });
      } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
      }
    });
  };
}

export default ConverterController;
