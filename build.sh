#! /bin/sh

cd client
npm i
npm run clean
npm run build
cd ../server
npm i
npm run clean
npm run build
cp -R ../client/public dist/

NODE_ENV=production node dist


