#!/bin/bash

# copy assets to dist

src_dirs=("src/images" "src/options" "src/sidepanels" "src/scripts"  )
dest_dirs=("dist/images" "dist/options" "dist/sidepanels" "dist/scripts" )

# copy files
for ((i = 0; i < ${#src_dirs[@]}; i++)); do
  src="${src_dirs[$i]}"
  dest="${dest_dirs[$i]}"
  echo "Copying from $src to $dest..."
  mkdir -p "$dest"
  cp -r "$src"/* "$dest"/
done

# single file
# mkdir dist/images
# cp src/images/* dist/images/
mkdir dist/css
cp src/css/button.css dist/css/
# cp src/background.js dist/
cp src/manifest.json dist/
