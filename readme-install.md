# 设置开发环境

## 安装 parcel

https://www.parceljs.cn/getting_started.html
npm install parcel-bundler --save-dev
npm init -y

npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

package.json:"scripts"

## 安装 tailwindcss

https://tailwindcss.com/docs/installation
npm install -D tailwindcss
npm install @tailwindcss/forms

npx tailwindcss init

tailwind.config.js
'''

## other

chmod +x copy-assets.sh

## deploy

npm run clean
npm run build
