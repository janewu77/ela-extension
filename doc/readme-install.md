# Dev Env Setting

### install parcel

https://www.parceljs.cn/getting_started.html

```bash
npm install parcel-bundler --save-dev
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
