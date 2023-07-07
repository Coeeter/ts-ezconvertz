<h1 align="center">
  <img src="public/ezconvertz-logo.svg" alt="Youtube To MP3" width="200">

EZConvertz

</h1>

## About

EZConvertz is a youtube to mp3 website where you can convert youtube urls to mp3 format and download them.

## Features

- Able to get metadata of video being converted by the url
- Able to change the name of the mp3 file to be converted to
- Able to trim the start and end of the mp3 files
- Able to convert and download multiple mp3 files as a zip file

## Usage

You can clone this repository and then run these commands:

```
npm install
npm run build
cd public
npm install
npm run build
cd ..
```

This will download all the dependencies needed for the website and server. Afterwards you can download the dependencies for python by using e.g. pip.

```
pip install pytube
pip install pydub
```

Afterwards you can start the server from now by just running the command:

```
npm start
```

## Built Using
- Node Js
  - TypeScript
  - cors
  - dotenv
  - express
  - uuid
  - zip-a-folder
  - python-shell
  - http-status-codes
- Python Scripts
  - pytube
  - pydub
- React
  - vite
  - TypeScript
  - Chakra UI
  - react-hook-form
  - react-router-dom

## Disclaimer

<b>This program should only be used on non-copyrighted material.</b>
