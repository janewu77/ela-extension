# ⚠️ 旧文档说明

> **此文档已不再更新，请查看新的开发者指南：**
> 
> 📖 **[DEVELOPMENT.md](../DEVELOPMENT.md)** - 完整的开发者指南（英文，推荐）
> 
> 📖 **[DEVELOPMENT.zh.md](../DEVELOPMENT.zh.md)** - 完整的开发者指南（中文）
> 
> 新文档包含更详细的内容和最新的开发流程说明。

---

# Dev Env Setting（旧文档，仅供参考）

### install parcel (v2)

https://parceljs.org/getting-started/webapp/

```bash
npm install parcel@^2.12.0 --save-dev
npm init -y

# Note: Parcel v2 is used in this project
# For CSS building, use the build:css script instead
npm run build:css
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
# 完整打包流程（推荐）
npm run pack

# 或者分步执行
npm run clean
npm run build
npm run zip
```

## 测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```
