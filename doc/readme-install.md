# Dev Env Setting

### install parcel

https://parceljs.org/getting-started/webapp/

```bash
npm install parcel --save-dev
npm init -y

npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

config file(s)：

- package.json:"scripts"

### install tailwindcss

https://tailwindcss.com/docs/installation

```bash
npm install -D tailwindcss
npm install @tailwindcss/forms

npx tailwindcss init
```

config file(s)：

- tailwind.config.js
- main.css

### Mac OS X lang设置
https://developer.chrome.com/docs/extensions/reference/api/i18n?hl=zh-cn
Mac OS X
要在 Mac 上更改语言区域，请使用系统偏好设置。

在 Apple 菜单中，选择系统偏好设置
在个人部分下，选择国际
选择语言和位置
重启 Chrome

## config

### other

```bash
cd sh
chmod +x copy-assets.sh
chmod +x zip.sh
```

## deploy

```bash
npm run clean
npm run build
npm run pack

```
