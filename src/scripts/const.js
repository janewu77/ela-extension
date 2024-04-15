
const debug = false;
const defaultOnoff = false; //是否打开功能

const default_auth_token="Your-OpenAI-API-Key";

const default_tts_endpoint="https://api.openai.com/v1/audio/speech";
const default_tts_model= "tts-1"; //tts-1 tts-1-hd
const default_tts_voice = "onyx"; //alloy, echo, fable, onyx, nova, and shimmer

const arrTTSModel = ["tts-1", "tts-1-hd"];
const arrTTSVoice = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];



const default_prompt_word = `  
- explain the word in detail in English
- phonetic notation
- common collocations or frequent word combinations
- examples in English
- explain the word in detail in Chinese
`;