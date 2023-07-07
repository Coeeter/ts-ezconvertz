import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'GET')
    return res.status(405).json({ message: 'Invalid method' });
  const { videoId } = req.query;
  if (!videoId || videoId.length == 0)
    return res.status(400).json({ message: 'Invalid videoId' });
  try {
    const video = await ytdl.getInfo(videoId as string);
    const lastPic = video.videoDetails.thumbnails.length - 1;
    res.json({
      name: video.videoDetails.title,
      length: video.videoDetails.lengthSeconds,
      thumbnail: video.videoDetails.thumbnails[lastPic].url,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
}
