#!/bin/bash


# 定义源目录和目标目录列表
src_dirs=("src/images" "src/options" "src/sidepanels" "src/scripts"  )
dest_dirs=("dist/images" "dist/options" "dist/sidepanels" "dist/scripts" )

# src_dirs=("src/images" "src/scripts")
# dest_dirs=("dist/images" "dist/scripts")

# 循环复制文件
for ((i = 0; i < ${#src_dirs[@]}; i++)); do
  src="${src_dirs[$i]}"
  dest="${dest_dirs[$i]}"
  echo "Copying from $src to $dest..."
  mkdir -p "$dest"
  cp -r "$src"/* "$dest"/
done

# # 单独复制的文件
# mkdir dist/images
# cp src/images/* dist/images/
cp src/css/button.css dist/css/
# cp src/background.js dist/
cp src/manifest.json dist/
