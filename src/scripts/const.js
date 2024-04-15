
const debug = false;
const defaultOnoff = false; //是否打开功能

const default_auth_token="Your-OpenAI-API-Key";

const default_tts_endpoint="https://api.openai.com/v1/audio/speech";
const default_tts_model= "tts-1"; //tts-1 tts-1-hd
const default_tts_voice = "onyx"; //alloy, echo, fable, onyx, nova, and shimmer

const arrTTSModel = ["tts-1", "tts-1-hd"];
const arrTTSVoice = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];


const default_chat_endpoint = "https://api.openai.com/v1/chat/completions";
const arrChatModel = ["gpt-3.5-turbo", "gpt-4-turbo"];
const defalut_llm_model = "gpt-3.5-turbo";
const default_action_prompt = `  
- explain the word in detail in English
- phonetic notation
- common collocations or frequent word combinations
- examples in English
- explain the word in detail in Chinese
`;
const default_action_name = `查单词`;


