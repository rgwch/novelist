#! /bin/sh

cd client_v2
npm run clean
npm run build
cd ../server
npm run clean
npm run build
touch server/tmp/restart.txt


