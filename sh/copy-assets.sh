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
