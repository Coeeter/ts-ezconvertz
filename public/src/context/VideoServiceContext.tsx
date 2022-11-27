import { createContext, useContext } from 'react';
import VideoService from '../service/VideoService';

const VideoServiceContext = createContext<VideoService | null>(null);

export const VideoServiceProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const service = new VideoService('http://localhost:8080');
  return (
    <VideoServiceContext.Provider value={service}>
      {children}
    </VideoServiceContext.Provider>
  );
};

export const useService = () => useContext(VideoServiceContext);
