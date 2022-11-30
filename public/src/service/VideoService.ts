import VideoData from '../models/VideoData';

export type YoutubeMetaData = {
  videoId: string;
  name?: string | undefined;
  length?: number | undefined;
  message?: string | undefined;
  thumbnail?: string | undefined;
};

class VideoService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Function to transform time string to seconds
   *
   * @param time in format HH:MM:SS
   * @returns the seconds of the time
   */
  transformTimeStringToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time
      .split(':')
      .map(item => parseInt(item));
    return seconds + minutes * 60 + hours * 60 * 60;
  };

  /**
   * Function to transform seconds to time string
   *
   * @param time the seconds of the time
   * @returns the time in format HH:MM:SS
   */
  transformSecondsToTimeString = (time: number) => {
    const hours = ~~(time / 3600);
    const minutes = ~~((time % 3600) / 60);
    const seconds = ~~(time % 60);
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  /**
   * Function to retrieve the name, length and thumbnail url of a youtube video by passing in its id
   *
   * @param videoId parameter v of youtube video url
   * @returns data retrieved by server such as name, thumbnail and length
   */
  getDataFromLink = async (videoId: string) => {
    const data: YoutubeMetaData = await fetch(`${this.baseUrl}/api/get-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    }).then(response => response.json());
    if (data.message || !data.name || !data.length)
      return console.error(data.message);
    return { ...data, videoId };
  };

  /**
   * Given an array of youtube video ids,
   * function will return blob,
   * containing all converted videos in zip format
   *
   * ```js
   * const blob = await service.downloadFromLinks(data);
   * const file = window.URL.createObjectURL(blob);
   * window.location.assign(file);
   * ```
   *
   * @param data array of videos which need to be converted
   * @returns a blob which can be used to download the file
   */
  downloadFromLinks = async (data: VideoData[]) => {
    return await fetch(`${this.baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videos: data,
      }),
    }).then(response => response.blob());
  };
}

export default VideoService;
