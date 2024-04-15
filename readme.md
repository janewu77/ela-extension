# 英文学习助手 ELA

## pre

为了方便自己练习口语，给自己写了一个 Chrome 插件。
用它来“读”一些网页，这样，我就能跟着反复读了。

未来，还打算加一些翻译、查单词的功能。

如果你也正好用得上，那就用用看吧。

欢迎反馈意见 欢迎 PR

## basic info

English learner Assistant

https://chromewebstore.google.com/detail/ela-%E8%8B%B1%E6%96%87%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/eepeblbmpkloajddpjlibamomldfhdga

- a chrome extentions 
- base on OpenAI TTS (text-to-speech) model [https://platform.openai.com/docs/guides/text-to-speech]

## 主要功能

- 朗读选择中的文字（base on OpenAI TTS）

## 如何安装

### 1. 通过 chrome store 安装

[打开商店进行安装](https://chromewebstore.google.com/detail/ela-%E8%8B%B1%E6%96%87%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/eepeblbmpkloajddpjlibamomldfhdga)

### 2. 本地安装

step1: 下载 zip & 解压  
archive/ela_0.1.1_20240409203228.zip

step2: 安指令进行安装  
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn#load-unpacked

step3: 设置  
打开“选项”填入 openAI-API-key  
![how to setting](/doc/images/setting.png)

## 如何使用

1. 打开侧边栏，打开右上角的开关。
2. 选中想要朗读的文字。文字将会出现在侧边栏内.
3. 点击文字下文的播放键开始朗读。
   ![how to setting](/doc/images/demo1.png)

#### 按钮说明

play：播放/继续播放/重新播放  
pause：暂停  
stop：停止播放（停止后，再点击 play，将会重新生成声音并播放）  
delete：删除这段内容

On/OFF：ON 网页上选中的内容，会出现在侧边栏内待读；off 关闭，网页上选中的内容不会出现在侧边栏内。  
Setting：参数设置，可以在这里指定声音模型。  
Clear all：删除侧边栏内的所有朗读的内容。

#### 打开/关闭侧边栏的快捷方式：

"windows": "Ctrl+Shift+S",
"mac": "Command+Shift+S",
"chromeos": "Ctrl+Shift+S",
"linux": "Ctrl+Shift+S"

注意：关闭侧边栏后，当前侧边栏上的所有朗读内容都会被删除。

## FAQ

- 在哪里能找到我的 OpenAI API Key?  
  https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key  
  https://platform.openai.com/api-keys

- 我的 OpenAI-API-Key 安全吗？
  用户的 OpenAI-API-Key 只在调用接口时传递给 openAI。
  除此之外，您的 OpenAI-API-Key 会保存在您的浏览器存储中。您可以在“选项”中，随时删除您的 OpenAI-API-Key。

- 哪些地区可以使用？
  如果您所在的地区，openAI 并不提供服务，则同样的，你也无法在这个 extentions 里使用。

## todo

- 下载声音文件
- 将内容导出至 notion
- 翻译段落\查单词
- 国际化 UI

## update.log

![how to setting](/doc/update.log.md)


