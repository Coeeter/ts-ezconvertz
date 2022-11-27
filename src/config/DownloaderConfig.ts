import path from 'path';
import YoutubeMp3Downloader from 'youtube-mp3-downloader';
import envConfig from './EnvConvig';

const downloader = new YoutubeMp3Downloader({
  ffmpegPath: envConfig.device.ffmpegPath,
  outputPath: path.join(__dirname, '..', '..', 'downloads'),
  progressTimeout: 2000,
  queueParallelism: 1,
  allowWebm: false,
  youtubeVideoQuality: 'highestaudio',
});

export default downloader;
