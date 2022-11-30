import sys
import json
import os
from types import SimpleNamespace
from pydub import AudioSegment
from pytube import YouTube

args = json.loads(sys.argv[1], object_hook=lambda d: SimpleNamespace(**d))

parent_dir = args.session
youtube_id = args.videoId
name = args.name
start = args.start
end = args.end

output_path = os.path.join("downloads", parent_dir)
youtube_url = f'https://youtube.com?v={youtube_id}'
file_name = f'{name}.mp3'

yt = YouTube(youtube_url)
video = yt.streams.filter(only_audio=True).first()
file = video.download(output_path=output_path, filename=file_name)

audio = AudioSegment.from_file(file)
audio_length = audio.duration_seconds

if end == -1 or end > audio_length:
  end = audio_length

start *= 1000
end *= 1000

audio_clip = audio[start:end]

audio_clip.export(file, format="mp3", tags={"title": name})
