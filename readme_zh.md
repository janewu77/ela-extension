# 英文学习助手 ELA

[English Version](./readme.md)

英文学习助手 English learner Assistant

https://chrome.google.com/webstore/detail/eepeblbmpkloajddpjlibamomldfhdga

- a chrome extentions
- base on OpenAI TTS (text-to-speech) model [https://platform.openai.com/docs/guides/text-to-speech]
- base on OpenAI gpt-4o, gpt-4o-mini model [https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo]

## 概述

一款帮助您提升英语水平的 AI 工具，采用了最新的文字转语音（Text to Speech TTS）、大语言模型(Large Language Model LLM)等 AI 技术来支持您的学习。

这款工具的易用性、高度定制性不仅适用于学习英语，还适合专业人士或学者深入阅读专业英文材料，以及用于学习其他语言，从而有效提高工作和学习效率。

![demo](/doc/images/0.3/zh/demo.png)

## 主要功能

1. **朗读功能**：

   - 利用 TTS（文字转语音）技术。
   - 当用户浏览网页时，能朗读选定的英文内容。
   - 增强听力练习，提升英语理解能力。

2. **翻译查词**：

   - 使用最新的 AI 技术（openAI ChatGPT）进行英文翻译、单词查询。
   - 帮助用户顺利阅读和扩大词汇量。

3. **自定义设置**：
   - 允许用户根据具体学习需求自定义功能。
   - 通过定义 prompt 来调整功能，实现个性化配置。

## 如何安装

### 1. 通过 chrome store 安装

[打开商店进行安装](https://chromewebstore.google.com/detail/ela-%E8%8B%B1%E6%96%87%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/eepeblbmpkloajddpjlibamomldfhdga)

### 2. 用压缩包安装（开发者模式）

step1: 下载 zip & 解压  
archive/ela\_{最新的版本}.zip

step2: 根据按装指令进行安装  
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn#load-unpacked

## 如何使用配置

- 打开“设置”填入 openAI-API-key  
  ![how to setting - key](/doc/images/0.3/zh/setting1.png)
- 配置自定义按钮
  ![how to setting - 1](/doc/images/0.3/zh/setting2.png)

## 如何使用

1. 打开侧边栏，打开右上角的开关。
2. 选中想要处理的文字段落。文字将会出现在侧边栏内。
3. 点击文字下方的【播放键】开始朗读。
4. 点击【英翻中】【查单词】，将执行相应的功能。

- 功能演示
  ![func](/doc/images/0.3/zh/func1.png)

#### 按钮说明

![button description](/doc/images/0.3/zh/sidepanel.png)

- 开/关：打开，网页上选中的内容，会出现在侧边栏内；关闭，网页上选中的内容不会出现在侧边栏内。
- 设置[选项]：进入参数设置。在设置里可以指定声音、语言的 AI 模型。
- 清除：清空侧边栏内的选中的内容。

- 播放：播放/继续播放/重新播放
- 暂停
- 停止：停止播放。停止后，再次点击播放，将会重新生成声音并播放。
- 下载：将生成的音频下载为 MP3 格式文件。只有在音频生成成功后，下载按钮才会启用。

- 英翻中：将英文翻译成中文。
- 查单词
- 自定义：自定义的功能。

#### 打开/关闭侧边栏的快捷方式：

"windows": "Ctrl+Shift+S"  
"mac": "Command+Shift+S"  
"chromeos": "Ctrl+Shift+S"  
"linux": "Ctrl+Shift+S"

注意：关闭侧边栏后，当前侧边栏上的所有内容都会被清除。

## FAQ

- **在哪里能找到我的 OpenAI API Key?**  
  https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key  
  https://platform.openai.com/api-keys

- **我的 OpenAI-API-Key 安全吗？**  
  用户的 OpenAI-API-Key 只在调用接口时传递给 openAI。
  除此之外，您的 OpenAI-API-Key 会保存在您的浏览器存储中。您可以在“选项”中，随时删除您的 OpenAI-API-Key。

- **哪些地区可以使用？**  
  如果您所在的地区，openAI 并不提供服务，则同样的，你也无法在这里使用。

- **提示词怎么写？**
  https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions

## 其他有用的资源

- [OpenAI 提示词工程指南](https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions): 针对 openAI 模型的提示词写作指南.
  - [OpenAI 试用入口](https://platform.openai.com/playground): 通过聊天界面调试 prompt.

## 更新日志

[更新日志](./doc/CHANGELOG.zh.md) | [Changelog](./doc/CHANGELOG.md)

## 如何贡献

欢迎贡献代码！请 Fork 项目并提交 Pull Request。

更多详细信息请参考：[开发者指南](./doc/DEVELOPMENT.zh.md)
