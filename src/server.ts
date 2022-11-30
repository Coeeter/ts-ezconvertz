import express, { Express } from 'express';
import envConfig from './config/EnvConvig';
import ConverterController from './controllers/ConverterController';

const app: Express = express();

app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const controller = new ConverterController();
app.post('/api/get-data', controller.getDataOfVideo);
app.post('/api/convert', controller.convertAndDownloadAudioAsZip);

app.listen(envConfig.server.port, () => {
  console.log(`Server listening on port ${envConfig.server.port}`);
});
