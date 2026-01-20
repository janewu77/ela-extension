#!/bin/bash

# copy assets to dist
src_dirs=("src/images" "src/options" "src/sidepanels" "src/scripts"  "src/css" "src/_locales")
dest_dirs=("dist/images" "dist/options" "dist/sidepanels" "dist/scripts" "dist/css" "dist/_locales")

# copy files
for ((i = 0; i < ${#src_dirs[@]}; i++)); do
  src="${src_dirs[$i]}"
  dest="${dest_dirs[$i]}"
  echo "Copying from $src to $dest..."
  mkdir -p "$dest"
  cp -r "$src"/* "$dest"/
done

# single file
cp src/manifest.json dist/

# 替换构建后的文件中的 process.env.NODE_ENV
# Parcel 不会替换通过 importScripts 加载的文件，需要手动替换
NODE_ENV=${NODE_ENV:-production}

if [ "$NODE_ENV" = "production" ]; then
  REPLACEMENT="'production'"
else
  REPLACEMENT="'development'"
fi

# 替换 dist/scripts/const.js 中的 process.env.NODE_ENV
if [ -f "dist/scripts/const.js" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/process\.env\.NODE_ENV/$REPLACEMENT/g" dist/scripts/const.js
  else
    # Linux
    sed -i "s/process\.env\.NODE_ENV/$REPLACEMENT/g" dist/scripts/const.js
  fi
  echo "Replaced process.env.NODE_ENV in dist/scripts/const.js with $REPLACEMENT"
fi
