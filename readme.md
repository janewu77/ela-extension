# English learner Assistant ELA

[中文说明](/doc/readme_zh.md)

English learner Assistant ELA

https://chrome.google.com/webstore/detail/eepeblbmpkloajddpjlibamomldfhdga

- a chrome extentions
- base on OpenAI TTS (text-to-speech) model [https://platform.openai.com/docs/guides/text-to-speech]
- base on OpenAI gpt-3.5-turbo, gpt-4-turbo model [https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo]

## Info

This AI tool is designed to enhance your English skills, employing advanced AI technologies including Text to Speech (TTS) and Large Language Model (LLM) to facilitate your learning.

Its user-friendly and highly customizable nature makes it ideal not only for English learners but also for professionals and scholars who need to read specialized English materials. Additionally, it can be used to learn other languages, significantly boosting your efficiency in both work and study.

![demo](/doc/images/0.3/en/demo.png)

## Key Features

1. **Reading aloud**:

   - Utilizes TTS (Text to Speech) technology.
   - Can read selected English content when users browse the web.
   - Enhances listening practice and improves English comprehension.

2. **Translation and word lookup**:

   - Uses the latest AI technology (openAI ChatGPT) for English translation and word lookup.
   - Helps users read smoothly and expand their vocabulary.

3. **Custom settings**:
   - Allows users to customize functions based on specific learning needs.
   - Adjust functions by defining prompts for personalized configuration.

## How to install

### 1. Install through the Chrome Store.

[goto Chrome Store](https://chromewebstore.google.com/detail/ela-%E8%8B%B1%E6%96%87%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B/eepeblbmpkloajddpjlibamomldfhdga)

### 2. Install an unpacked extension in developer mode.

step1: download zip & unzip
archive/ela\_{The latest released version}.zip

step2: following the provided installation instructions
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=en#load-unpacked


## How to config

- Open the "Settings" and input your OpenAI-API-Key.
  ![how to setting - key](/doc/images/0.3/en/setting1.png)
- Configure custom buttons
  ![how to setting - 1](/doc/images/0.3/en/setting2.png)

## How to Use

1. Open the side panel, turn on the switch at the top right corner.
2. Select the text paragraph you want to process. The text will appear in the side panel.
3. Click the [Play] button below the text to start reading aloud.
4. Use the [Translate to Chinese] and [Look up words] buttons to access these specific functions.

- demo
  ![func](/doc/images/0.3/en/func1.png)

#### Description of button functions

![button functions](/doc/images/0.3/en/sidepanel.png)

- On/OFF: on, the content selected on the webpage will appear in the side panel.
- Setting: Parameter settings. You can specify the AI model for sound and language in the settings.
- Clear all: Clear all contents in the side panel.

- Play: Play/Continue playing/Replay
- Pause: Pause
- Stop: Stop playback. After stopped, clicking play again will regenerate the sound and play it.

- Translate: Translate English into Chinese.
- word:Look up words
- Custom functions

#### shortcut to Open/Close the side panel：

"windows": "Ctrl+Shift+S"  
"mac": "Command+Shift+S"  
"chromeos": "Ctrl+Shift+S"  
"linux": "Ctrl+Shift+S"

p.s. After closing the sidebar, all content currently on the sidebar will be deleted.

## FAQ

- **Where do I find my openai api key?**  
  https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key  
  https://platform.openai.com/api-keys

- **Is my OpenAI-API-Key safe？**  
  Your OpenAI-API-Key is only transmitted to OpenAI when the interface is invoked. Additionally, your OpenAI-API-Key is saved in your browser's storage. You can delete your OpenAI-API-Key at any time from the "Options" menu.

- **In which regions is this available?**  
  If OpenAI does not offer services in your area, you will also be unable to use this extension there.

## update.log

[update.log](/doc/update.log.md)

## How to Contribute

Contributions are highly encouraged! Please fork and submit a PR.
