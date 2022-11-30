import sys
import json
from pytube import YouTube

video_id = sys.argv[1]
youtube_url = f'https://youtube.com?v={video_id}'

yt = YouTube(youtube_url)
payload = json.dumps({
  "name": yt.title,
  "length": yt.length,
  "thumbnail": yt.thumbnail_url
})

print(payload)
