#! /bin/sh

cd client
npm run clean
npm run build:tailwind
npm run build
cd ../server
npm run clean
npm run build
cp -R ../client/public dist/

NODE_ENV=production node dist


