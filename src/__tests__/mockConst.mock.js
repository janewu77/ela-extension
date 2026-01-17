/**
 * Mock 常量文件
 * 用于测试环境，模拟 const.js 中定义的常量
 * 其他测试文件可以引入此文件使用统一的 mock 常量
 * 
 * 注意：const.js 中的常量是全局定义的，不导出
 * 这里手动定义相同的常量值，确保与源代码一致
 */

const mockConstants = {
  debug: false, // 测试环境关闭 debug
  defaultOnoff: false,
  default_auth_token: "Your-OpenAI-API-Key",
  default_tts_endpoint: "https://api.openai.com/v1/audio/speech",
  default_tts_model: "gpt-4o-mini-tts",
  default_tts_voice: "marin",
  default_chat_endpoint: "https://api.openai.com/v1/chat/completions",
  default_chat_model: "gpt-4.1-mini",
  default_action_items: [
    { 
      name: '翻译🇺🇸🇨🇳', 
      active: true, 
      prompt: '你是一位精通简体中文的专业翻译，尤其擅长将专业学术论文翻译成浅显易懂的科普文章。请将用户提供的英文段落翻译成中文，风格与中文科普读物相似。',
      other: false
    },
    { 
      name: 'word📖', 
      active: true, 
      prompt: '- explain the word in detail in English\n- phonetic notation\n- common collocations or frequent word combinations\n- examples in English\n- explain the word in detail in Chinese',
      other: false
    },
    { 
      name: '总结', 
      active: false, 
      prompt: 'summary',
      other: false
    },
    { name: 'action 4', active: false, prompt: '', other: false },
    { name: 'action 5', active: false, prompt: '', other: false },
    { name: 'action 6', active: false, prompt: '', other: false }
  ],
  arrTTSModel: ["tts-1", "tts-1-hd", "gpt-4o-mini-tts", "gpt-4o-mini-tts-2025-12-15"],
  arrTTSVoice: ["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse", "marin", "cedar"],
  arrChatModel: [
    "gpt-4.1-nano",
    "gpt-4.1-mini",
    "gpt-4.1",
    "gpt-5-nano",
    "gpt-5-mini",
    "gpt-5.2",
    "gpt-4o-mini"
  ]
};

/**
 * 设置全局 mock 常量
 * 在测试文件中调用此函数来设置全局变量
 */
function setupMockConstants() {
  global.debug = mockConstants.debug;
  global.defaultOnoff = mockConstants.defaultOnoff;
  global.default_auth_token = mockConstants.default_auth_token;
  global.default_tts_endpoint = mockConstants.default_tts_endpoint;
  global.default_tts_model = mockConstants.default_tts_model;
  global.default_tts_voice = mockConstants.default_tts_voice;
  global.default_chat_endpoint = mockConstants.default_chat_endpoint;
  global.default_chat_model = mockConstants.default_chat_model;
  global.default_action_items = mockConstants.default_action_items;
  global.arrTTSModel = mockConstants.arrTTSModel;
  global.arrTTSVoice = mockConstants.arrTTSVoice;
  global.arrChatModel = mockConstants.arrChatModel;
}

module.exports = {
  mockConstants,
  setupMockConstants
};
