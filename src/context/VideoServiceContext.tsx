import { createContext, useContext } from 'react';

import VideoData from '@/models/VideoData';
import YoutubeMetaData from '@/models/YoutubeMetaData';

type VideoServiceContextType = {
  getDownloadUrl: (session: string) => string;
  transformTimeStringToSeconds: (time: string) => number;
  transformSecondsToTimeString: (time: number) => string;
  getDataFromLink: (videoId: string) => Promise<YoutubeMetaData | undefined>;
  convertVideos: (data: VideoData[]) => Promise<string | undefined>;
};

const VideoServiceContext = createContext<VideoServiceContextType | undefined>(
  undefined
);

export const VideoServiceProvider = ({ children }: React.PropsWithChildren) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  const getDownloadUrl = (session: string) => {
    return `${baseUrl}/api/download/${session}`;
  };

  const transformTimeStringToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const transformSecondsToTimeString = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const getDataFromLink = async (videoId: string) => {
    const res = await fetch(`${baseUrl}/api/video/${videoId}`);
    if (!res.ok) return;
    const data = await res.json();
    return {
      videoId,
      ...data,
    };
  };

  const convertVideos = async (data: VideoData[]) => {
    const res = await fetch(`${baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videos: data }),
    });
    if (!res.ok) return;
    const { session } = await res.json();
    return session as string;
  };

  return (
    <VideoServiceContext.Provider
      value={{
        getDownloadUrl,
        transformTimeStringToSeconds,
        transformSecondsToTimeString,
        getDataFromLink,
        convertVideos,
      }}
    >
      {children}
    </VideoServiceContext.Provider>
  );
};

export const useService = () => {
  const service = useContext(VideoServiceContext);
  if (!service) {
    throw new Error('useService must be used within a VideoServiceProvider');
  }
  return service;
};
