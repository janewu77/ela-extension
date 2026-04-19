# Chrome Web Store — Store Listing Copy

## Single-Purpose Statement

_(CWS Developer Dashboard → "Single purpose" field)_

> Helps anyone reading foreign-language content improve comprehension by listening to selected webpage text aloud, with built-in translation and vocabulary lookup powered by AI.

---

## Short Description

_(≤ 132 characters)_

> AI reading companion: text-to-speech, translation, word lookup, and fully customizable AI actions for any language.

Character count: 115

---

## Detailed Description

```
Struggling to read articles in a foreign language? ELA uses AI (GPT-4o) to help you translate, look up words, and read text aloud — all in a clean side panel. Works with English, German, French, Japanese, Spanish, and any language you're learning. Customize your own AI prompts for a personalized learning experience.

Simply select any text and the side panel instantly captures it, ready for you to listen to, translate, or explore. Whether you're an English learner tackling unfamiliar vocabulary, a German learner reading news articles, a professional working through technical documents, or a researcher navigating academic papers, ELA keeps you in your reading flow without switching tabs or apps.


## Key Features
- Text-to-Speech: Hear any selected text read aloud in natural-sounding voices powered by OpenAI TTS.
- Pre-configured AI buttons: Comes with default buttons for Chinese translation and word lookup, ready to use out of the box.
- Fully customizable buttons: Replace or extend the default buttons with your own prompt-based actions — tailor ELA to any language, subject, or workflow.
- Multi-language support: Not limited to English. Use ELA to listen to and study content in any language — German, French, Japanese, and more. Custom buttons can be configured for any language pair or learning task.
- Flexible voice settings: Choose your preferred OpenAI TTS voice model in Settings.


## How to Set Up
1. Open the extension's Settings page.
2. Enter your OpenAI API key.
3. Select a voice model.
4. Optionally, add custom AI buttons with your own prompts.


## How to Use
1. Open the side panel and turn on the toggle in the top-right corner.
2. Select any text on a webpage — it will automatically appear in the side panel.
3. Click [Play] to have the text read aloud.
4. Use the pre-configured [Translate] and [Word Lookup] buttons, or any custom buttons you've set up in Settings.


## Button Reference
- On/Off toggle: Enables or disables automatic text capture from the webpage.
- Settings: Opens the configuration page for API key, voice model, and custom buttons.
- Clear All: Removes all content from the side panel.
- Play: Plays, resumes, or replays the audio.
- Pause: Pauses playback.
- Stop: Stops playback. The next time you press Play, the audio will be regenerated.
- Translate / Word Lookup: Pre-configured default buttons — translate text to Chinese and look up words out of the box. These can be modified or replaced in Settings.
- Download: Downloads the generated audio as an MP3 file. Only enabled after audio has been successfully generated.
- Custom buttons: Your own AI-powered actions, defined in Settings. Add as many as you need for any language or task.


## Privacy & Permissions
• All your settings — including your API key and custom prompts — are stored locally in Chrome Storage. Nothing is sent to any server operated by ELA.
• Your API key is used solely to make requests to the AI provider you've configured (e.g. OpenAI). It is never shared with or accessible by the extension developer.
• The extension is only activated when you explicitly interact with it — it does not run in the background or monitor your browsing.
• storage permission: saves your API key, voice model preference, and custom button prompts locally on your device.

ELA is fully open source. You can inspect the code at any time on GitHub: https://github.com/janewu77/ela-extension


## Keyboard Shortcut to Open/Close the Side Panel
- Windows / ChromeOS / Linux: Ctrl+Shift+S
- Mac: Command+Shift+S

Note: 
Closing the side panel will clear all content currently displayed in it.
No account required. No data collected.

```

## privacy

---

## Permission Justifications

_(CWS Developer Dashboard → Privacy practices → Permission justification)_

**storage justification**
Used to persist user settings locally, including the OpenAI API key, selected voice model, and custom button configurations.

**sidePanel justification**
Used to display the side panel interface where selected text, playback controls, translation results, and word lookup results are shown.

**Host permission justification**
Required to capture text selected by the user on any webpage and send it to the side panel for processing (text-to-speech, translation, etc.).

## Screenshots

1.  Up to a maximum of 5
    1280x800 or 640x400
    JPEG or 24-bit PNG (no alpha)
    At least one is required

2.  Small promo tile
    440x280 Canvas
    JPEG or 24-bit PNG (no alpha)

3.  Marquee promo tile
    1400x560 Canvas
    JPEG or 24-bit PNG (no alpha)
