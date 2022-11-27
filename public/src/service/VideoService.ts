import VideoData from '../models/VideoData';

class VideoService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Function to transform time string to seconds
   * @param time in format HH:MM:SS
   * @returns the seconds of the time
   */
  transformTimeStringToMinutes = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');
    return (
      parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 60 * 60
    );
  };

  downloadFromLinks = async (data: VideoData[]) => {
    const blob = await fetch(`${this.baseUrl}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.blob());
    const file = window.URL.createObjectURL(blob);
    window.location.assign(file);
  };
}

export default VideoService;
