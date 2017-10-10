#!/bin/sh
git checkout master
git branch -D gh-pages
git checkout -b gh-pages
npm run build:dist
rm -rf assets assets_raw templates webpack.d* README.md
cp -r dist/* .
git add .
git commit -m"Build"
git push -f origin gh-pages

