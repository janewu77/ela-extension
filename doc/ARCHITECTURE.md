# ELA Extension System Architecture Documentation

[中文版本](./ARCHITECTURE.zh.md)

## Table of Contents

- [1. System Overview](#1-system-overview)
- [2. Architecture Design](#2-architecture-design)
- [3. Core Modules](#3-core-modules)
- [4. Data Flow](#4-data-flow)
- [5. Technology Stack](#5-technology-stack)
- [6. Build & Deployment](#6-build--deployment)
- [7. Security Considerations](#7-security-considerations)

---

## 1. System Overview

### 1.1 Project Introduction

ELA (English Learner Assistant) is a Chrome Extension-based English learning assistant that leverages OpenAI's TTS (Text-to-Speech) and LLM (Large Language Model) technologies to provide users with:

- **Text-to-Speech**: Convert selected English text to speech playback
- **Translation**: Translate English to Chinese
- **Word Lookup**: Detailed explanations of English words
- **Custom Functions**: User-configurable custom AI action buttons

### 1.2 System Features

- Based on Chrome Extension Manifest V3
- Side Panel interface support
- Real-time text selection and content synchronization
- Streaming AI response processing
- Audio playback control (play, pause, stop, loop)
- Multi-language support (English and Chinese)
- Configurable AI models and parameters

---

## 2. Architecture Design

### 2.1 Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Chrome Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │   Web Page   │      │  Content     │      │ Side Panel │ │
│  │              │◄────►│  Script      │◄────►│            │ │
│  │  (User View) │      │              │      │  (Main UI)  │ │
│  └──────────────┘      └──────┬───────┘      └──────┬─────┘ │
│                               │                      │       │
│                               └──────────┬───────────┘       │
│                                          │                   │
│                                  ┌───────▼────────┐          │
│                                  │  Background    │          │
│                                  │  Service Worker│          │
│                                  └───────┬────────┘          │
│                                          │                   │
│                                  ┌───────▼────────┐          │
│                                  │  Chrome Storage │          │
│                                  │  (Local Storage)│          │
│                                  └─────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   OpenAI API          │
                    │   - TTS API           │
                    │   - Chat API          │
                    └───────────────────────┘
```

### 2.2 Module Hierarchy

```
ELA Extension
│
├── Background Service Worker (background.js)
│   ├── Extension lifecycle management
│   ├── Storage initialization
│   └── Message routing
│
├── Content Script (content.js)
│   ├── Text selection monitoring
│   ├── Message sending
│   └── State synchronization
│
├── Side Panel (sidepanel.js)
│   ├── UI management
│   ├── State management
│   └── Message handling
│
├── Playback Module (playback.js)
│   ├── Content block management
│   ├── Audio playback control
│   └── UI creation
│
├── Chat Action Module (chataction.js)
│   ├── Custom button management
│   ├── AI response display
│   └── Streaming response handling
│
├── API Module (api.js)
│   ├── TTS API calls
│   ├── Chat API calls
│   └── Streaming response handling
│
├── Storage Module (storage.js)
│   ├── Storage operation encapsulation
│   ├── Batch operations
│   └── Listener management
│
├── Options Page (options.js)
│   ├── Configuration management
│   ├── TTS settings
│   ├── Chat settings
│   └── Action Items configuration
│
└── Constants (const.js)
    ├── Default configuration
    ├── Model options
    └── Debug configuration
```

---

## 3. Core Modules

### 3.1 Background Service Worker

**File**: `src/background.js`

**Responsibilities**:
- Extension installation/update initialization
- Extension badge state management
- Monitor storage changes and update UI
- Handle extension lifecycle events

**Key Functions**:
```javascript
// Initialize extension configuration
initializeExtension()
  - Initialize storage default values
  - Set side panel behavior
  - Update badge state

// Storage listener
createStorageListener('onoff', callback)
  - Monitor on/off state changes
  - Update badge display
```

### 3.2 Content Script

**File**: `src/scripts/content.js`

**Responsibilities**:
- Injected into all web pages
- Monitor user text selection
- Send selected text to extension

**Key Functions**:
```javascript
// Text selection handling
handleTextSelection()
  - Get selected text
  - Check if extension is enabled
  - Send message to sidepanel

// State synchronization
initializeState()
  - Read onoff state from storage
  - Monitor storage changes
  - Update local state
```

**Message Format**:
```javascript
{
  type: "selectedText",
  msg: "Selected text content",
  isTopFrame: true/false
}
```

### 3.3 Side Panel

**File**: `src/sidepanels/sidepanel.js`

**Responsibilities**:
- Manage side panel UI
- Handle messages from content script
- Manage configuration state
- Initialize sub-modules

**Key Functions**:
```javascript
// Initialization
init()
  - Initialize UI elements
  - Load configuration
  - Set up storage listeners
  - Initialize buttons and message listeners

// Message handling
setupMessageListeners()
  - Receive selectedText messages
  - Create content blocks
  - Respond to messages

// Configuration management
initConfig()
  - Load TTS configuration
  - Load Chat configuration
  - Load Action Items
```

### 3.4 Playback Module

**File**: `src/sidepanels/playback.js`

**Responsibilities**:
- Manage content block creation and deletion
- Control audio playback (play, pause, stop)
- Manage audio resources (AudioContext, AudioBuffer)

**Key Functions**:
```javascript
// Content block management
add_content_block(msg)
  - Create new content block
  - Insert at top of container
  - Initialize resource mappings

// Audio playback
playAudioBuffer(uuid, onBefore, onEnded)
  - Create AudioContext
  - Decode audio data
  - Play audio
  - Handle loop playback

// Resource management
btnStopClicked(uuid)
  - Stop audio playback
  - Clean up AudioContext
  - Clear cache
```

**Resource Mappings**:
- `mapAudioContext`: Store AudioContext for each content block
- `mapAudioBufferCache`: Cache audio data
- `mapSource`: Current playing audio source
- `mapMsg`: Text content
- `mapAudioLoop`: Loop playback settings

### 3.5 Chat Action Module

**File**: `src/sidepanels/chataction.js`

**Responsibilities**:
- Create custom action buttons
- Handle AI function calls
- Display AI responses (supports streaming)
- Provide copy and clear functionality

**Key Functions**:
```javascript
// Custom panel creation
createCustomPannel(uuid)
  - Create response display area
  - Create action button panel
  - Create menu buttons (copy/clear)

// AI call
fetchChat(msg, prompt, onSuccess, onError)
  - Call Chat API
  - Handle streaming responses
  - Update UI state
```

### 3.6 API Module

**File**: `src/sidepanels/api.js`

**Responsibilities**:
- Encapsulate TTS API calls
- Encapsulate Chat API calls
- Handle streaming responses

**Key Functions**:
```javascript
// TTS API
fetchAudio(msg, onSuccess, onError)
  - POST request to TTS endpoint
  - Return ArrayBuffer
  - Error handling

// Chat API
fetchChat(msg, prompt, onSuccess, onError, stream)
  - POST request to Chat endpoint
  - Support streaming and non-streaming responses
  - Error handling

// Streaming response handling
streamResponseRead(reader, afterGetContent, onDone)
  - Read stream data
  - Parse JSON
  - Update content in real-time
```

### 3.7 Storage Module

**File**: `src/scripts/storage.js`

**Responsibilities**:
- Encapsulate Chrome Storage API
- Provide unified storage operation interface
- Manage storage listeners

**Key Functions**:
```javascript
// Basic operations
getStorageValue(key)
setStorageValue(key, value)
getStorageValues(keys)
setStorageValues(values)
removeStorageValue(key)
clearStorage()

// Initialization
initStorageValue(key, defaultValue)
initStorageValues(config)

// Listeners
createStorageListener(keys, callback)
  - Create filtered storage listener
  - Return removal function
```

**Storage Keys**:
- `onoff`: On/off state
- `auth_token`: API Key
- `tts_endpoint`: TTS API endpoint
- `tts_model`: TTS model
- `tts_voice`: TTS voice
- `chat_endpoint`: Chat API endpoint
- `chat_model`: Chat model
- `action_items`: Custom action button configuration

### 3.8 Options Page

**File**: `src/options/options.js`

**Responsibilities**:
- Manage extension configuration interface
- Configure TTS parameters
- Configure Chat parameters
- Manage Action Items

**Key Functions**:
```javascript
// TTS configuration
initTTSEndpoint(form)
initTTSModel(form)
initTTSVoice(form)
initAPIKey(form)

// Chat configuration
initChatEndpoint(form)
initChatModel(form)

// Action Items configuration
initActionItems(form)
  - Load existing configuration
  - Support add/delete/edit
  - Save configuration
```

### 3.9 Constants

**File**: `src/scripts/const.js`

**Responsibilities**:
- Define all constants
- Default configuration values
- Model option lists
- Debug configuration

**Key Constants**:
```javascript
// Debug
const debug = process.env.NODE_ENV !== "production"

// Default values
const defaultOnoff = false
const default_auth_token = "Your-OpenAI-API-Key"
const default_tts_endpoint = "https://api.openai.com/v1/audio/speech"
const default_tts_model = "gpt-4o-mini-tts"
const default_tts_voice = "marin"
const default_chat_endpoint = "https://api.openai.com/v1/chat/completions"
const default_chat_model = "gpt-4.1-mini"

// Option lists
const arrTTSModel = [...]
const arrTTSVoice = [...]
const arrChatModel = [...]
const default_action_items = [...]
```

---

## 4. Data Flow

### 4.1 Text Selection Flow

```
User selects text
    │
    ▼
Content Script listens to mouseup event
    │
    ▼
Check onoff state
    │
    ▼
Get selected text
    │
    ▼
Send message to Background
    │
    ▼
Background routes to Side Panel
    │
    ▼
Side Panel receives message
    │
    ▼
Call add_content_block()
    │
    ▼
Create content block UI
    │
    ▼
Display in side panel
```

### 4.2 TTS Playback Flow

```
User clicks play button
    │
    ▼
Playback Module checks cache
    │
    ├─ Has cache ──► Play directly
    │
    └─ No cache ──► Call fetchAudio()
            │
            ▼
        API Module sends request
            │
            ▼
        OpenAI TTS API
            │
            ▼
        Returns ArrayBuffer
            │
            ▼
        Decode audio data
            │
            ▼
        Cache to mapAudioBufferCache
            │
            ▼
        Create AudioContext
            │
            ▼
        Play audio
            │
            ▼
        Handle loop playback
```

### 4.3 Chat Function Flow

```
User clicks custom button
    │
    ▼
Chat Action Module gets message and prompt
    │
    ▼
Call fetchChat()
    │
    ▼
API Module sends request
    │
    ▼
OpenAI Chat API (streaming response)
    │
    ▼
streamResponseRead() reads stream
    │
    ▼
Update textarea content in real-time
    │
    ▼
Display complete, enable copy/clear buttons
```

### 4.4 Configuration Update Flow

```
User modifies configuration in Options Page
    │
    ▼
Options Module saves to Storage
    │
    ▼
Chrome Storage triggers onChanged event
    │
    ▼
Background and Side Panel listeners trigger
    │
    ▼
Update local state variables
    │
    ▼
Update UI display
```

---

## 5. Technology Stack

### 5.1 Core Technologies

- **Chrome Extension Manifest V3**: Extension framework
- **JavaScript (ES6+)**: Main programming language
- **Chrome Storage API**: Data persistence
- **Chrome Side Panel API**: Side panel interface
- **Web Audio API**: Audio playback
- **Fetch API**: HTTP requests
- **Streams API**: Streaming data processing

### 5.2 Build Tools

- **Parcel**: Bundler
- **Tailwind CSS**: CSS framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing

### 5.3 External Dependencies

- **OpenAI API**: 
  - TTS API (Text-to-Speech)
  - Chat API (GPT models)
- **Marked**: Markdown parsing (optional)

### 5.4 Development Tools

- **Chrome DevTools**: Debugging tools
- **Git**: Version control
- **npm**: Package management

---

## 6. Build & Deployment

### 6.1 Project Structure

```
ela-extension/
├── src/                    # Source code
│   ├── background.js       # Service Worker
│   ├── manifest.json       # Extension manifest
│   ├── scripts/            # Shared scripts
│   │   ├── const.js        # Constants
│   │   ├── content.js      # Content Script
│   │   ├── storage.js      # Storage utilities
│   │   └── ...
│   ├── sidepanels/         # Side panel related
│   │   ├── sidepanel.js    # Main logic
│   │   ├── playback.js     # Playback module
│   │   ├── api.js          # API calls
│   │   └── chataction.js   # Chat actions
│   ├── options/            # Options page
│   ├── css/                # Stylesheets
│   └── images/             # Image resources
├── dist/                   # Build output
├── cfg/                    # Configuration files
├── doc/                    # Documentation
├── sh/                     # Script files
└── package.json            # Project configuration
```

### 6.2 Build Process

```bash
# Development mode
npm run watch
  - Sync version number
  - Build CSS
  - Copy assets
  - Watch for file changes

# Production build
npm run build
  - Sync version number
  - Production CSS
  - Parcel bundling
  - Copy assets

# Package for release
npm run pack
  - Clean old files
  - Build project
  - Package ZIP
```

### 6.3 Build Scripts

- `sync-version.sh`: Sync version number to manifest.json
- `copy-assets.sh`: Copy static assets to dist
- `zip.sh`: Package extension as ZIP file

### 6.4 Deployment Process

1. **Development**: Use `npm run watch` for development
2. **Testing**: Load `dist` directory in Chrome for testing
3. **Build**: Run `npm run build` to generate production version
4. **Package**: Run `npm run pack` to generate ZIP file
5. **Publish**: Upload ZIP to Chrome Web Store

---

## 7. Security Considerations

### 7.1 Data Security

- **API Key Storage**: Stored in Chrome Storage Local, only transmitted to OpenAI
- **Sensitive Information**: API Key masked in logs
- **Input Validation**: All user inputs are validated

### 7.2 XSS Protection

- **Text Content**: Use `textContent` instead of `innerHTML`
- **SVG Icons**: Only use predefined constant SVGs
- **User Input**: All user inputs are escaped

### 7.3 Permission Management

**manifest.json permissions**:
```json
{
  "permissions": ["storage", "sidePanel"]
}
```

- Principle of least privilege
- Only request necessary permissions
- No `*` wildcards

### 7.4 Error Handling

- Unified error handling mechanism
- User-friendly error messages
- Detailed debug logs (development mode only)

---

## 8. Extension Points

### 8.1 Configurable Items

- TTS models and voices
- Chat models
- Custom Action Items (up to 6)
- API endpoints (supports custom)

### 8.2 Internationalization

- Supports English and Chinese
- Uses Chrome i18n API
- Message files: `_locales/en/messages.json`, `_locales/zh_CN/messages.json`

### 8.3 Testing

- Unit tests: Jest
- Test files: `src/__tests__/`
- Coverage target: > 80%

---

## 9. Performance Optimization

### 9.1 Audio Caching

- Audio data cached to `mapAudioBufferCache`
- Avoid duplicate requests for same text

### 9.2 Streaming Responses

- Chat API uses streaming responses
- Real-time UI updates for better user experience

### 9.3 Resource Management

- Timely cleanup of AudioContext
- Clean up related resources when deleting content blocks

---

## 10. Future Improvements

### 10.1 Planned Features

- [ ] Support more languages
- [ ] History functionality
- [ ] Export functionality
- [ ] Customizable shortcuts
- [ ] Theme switching

### 10.2 Technical Improvements

- [ ] TypeScript migration
- [ ] Modular refactoring (ES Modules)
- [ ] State management optimization
- [ ] Performance monitoring

---

## Appendix

### A. Related Documentation

- [Developer Guide](./DEVELOPMENT.md)
- [Changelog](./CHANGELOG.md)
- [Optimization Recommendations](./OPTIMIZATION_SUMMARY.md)

### B. External Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Document Version**: 1.0  
**Last Updated**: 2026  
**Maintainer**: ELA Extension Team
