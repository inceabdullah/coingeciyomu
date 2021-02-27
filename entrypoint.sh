#!/bin/sh -l
cd /app
npm install
xvfb-run -a --server-args"-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" command-that-runs-chrome &
npm start
sleep 1200 &&
ls /app

