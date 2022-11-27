import express, { Express, Request, Response } from 'express';
import { rm, unlink } from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { v4 } from 'uuid';
import { zip } from 'zip-a-folder';
import envConfig from './config/EnvConvig';
import runPythonScript from './utils/runPythonScript';

const app: Express = express();

app.use(require('cors')());
app.use(express.json());

app.post('/convert', (req: Request, res: Response) => {
  const session = v4();
  console.log(`session: ${session}`);
  const { videos } = req.body;
  if (!videos || videos.length == 0)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid videos' });
  const videoDataList: VideoData[] = videos;
  let finished: string[] = [];
  videoDataList.forEach(async videoData => {
    try {
      await runPythonScript('scripts/converter.py', {
        mode: 'text',
        args: [session, videoData.videoId, videoData.name],
      });
      const folderPath = path.join(__dirname, '..', 'downloads', session);
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
    }
  });
});

app.listen(envConfig.server.port, () => {
  console.log(`Server listening on port ${envConfig.server.port}`);
});
