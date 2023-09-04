import ytMusic from '@/lib/ytMusic';
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
    const song = await ytMusic.getSong(videoId as string);
    res.json({
      name: song.name,
      length: video.videoDetails.lengthSeconds,
      thumbnail: song.thumbnails.at(-1)!.url,
      artist: song.artists?.map(a => a.name).join(', '),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
}
