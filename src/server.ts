import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import envConfig from './config/EnvConvig';
import ConverterController from './controllers/ConverterController';

const app: Express = express();

app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public', 'dist')));

const controller = new ConverterController();
app.post('/api/get-data', controller.getDataOfVideo);
app.post('/api/convert', controller.convertAndDownloadAudioAsZip);
app.get('/api/download/:session', controller.downloadZip);

app.use((req: Request, res: Response, next: NextFunction) => {
  const pathToFile = path.join(__dirname, '..', 'public', 'dist', 'index.html');
  res.sendFile(pathToFile);
});

app.listen(envConfig.server.port, () => {
  console.log(`Server listening on port ${envConfig.server.port}`);
});
