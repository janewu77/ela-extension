# 参与贡献 ELA

[English Version](./CONTRIBUTING.md)

欢迎参与贡献！以下是快速上手的流程。

## Fork & Clone

1. 在 GitHub 上 Fork 本仓库
2. 克隆到本地：

```bash
git clone https://github.com/<你的用户名>/ela-extension.git
cd ela-extension
```

3. 添加上游仓库：

```bash
git remote add upstream https://github.com/janewu77/ela-extension.git
```

## 本地运行

**环境要求**：Node.js >= 18.17.1、npm >= 9.6.7、Chrome 浏览器

```bash
npm install
npm run watch
```

然后在 Chrome 中加载扩展：

1. 打开 `chrome://extensions/`
2. 开启**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择项目的 `dist/` 目录

完整开发环境配置请参考 [doc/DEVELOPMENT.md](./doc/DEVELOPMENT.md)。

## 修改代码

1. 从 `dev` 分支创建新分支：

```bash
git checkout dev
git pull upstream dev
git checkout -b feat/你的功能名称
```

2. 在 `src/` 目录下进行修改
3. 提交前执行以下检查：

```bash
npm run lint:fix && npm run format && npm test
```

## 提交 PR

1. 将分支推送到你的 Fork：

```bash
git push origin feat/你的功能名称
```

2. 向上游仓库的 `dev` 分支发起 Pull Request
3. 在 PR 描述中说明改动内容和原因

请确保 lint、格式化、测试全部通过后再请求 review。
