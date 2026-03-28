# Contributing to ELA

[中文版](./CONTRIBUTING.zh.md)

Thanks for your interest in contributing! Here's how to get started.

## Fork & Clone

1. Fork the repo on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/ela-extension.git
cd ela-extension
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/janewu77/ela-extension.git
```

## Run Locally

**Requirements**: Node.js >= 18.17.1, npm >= 9.6.7, Chrome

```bash
npm install
npm run watch
```

Then load the extension in Chrome:

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `dist/` folder

For full setup details, see [doc/DEVELOPMENT.md](./doc/DEVELOPMENT.md).

## Make Changes

1. Create a branch from `dev`:

```bash
git checkout dev
git pull upstream dev
git checkout -b feat/your-feature-name
```

2. Make your changes in `src/`
3. Before committing, run:

```bash
npm run lint:fix && npm run format && npm test
```

## Submit a PR

1. Push your branch to your fork:

```bash
git push origin feat/your-feature-name
```

2. Open a Pull Request against the `dev` branch of the upstream repo
3. Describe what you changed and why

Please ensure all checks pass (lint, format, tests) before requesting a review.
