import sys
from pytube import YouTube

parent_dir = sys.argv[1]
youtube_id = sys.argv[2]
name = sys.argv[3]

output_path = f'downloads/{parent_dir}'
youtube_url = f'https://youtube.com?v={youtube_id}'
file_name = f'{name}.mp3'

yt = YouTube(youtube_url)
video = yt.streams.filter(only_audio=True).first()
file = video.download(output_path=output_path, filename=file_name)

print(name)
