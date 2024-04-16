
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


const defalut_action_word = {
    "name": '查单词', 
    "prompt":  `  
    - explain the word in detail in English
    - phonetic notation
    - common collocations or frequent word combinations
    - examples in English
    - explain the word in detail in Chinese
    `,
    "other":false
  };

const defalut_action_transalate = {
    "name": '英翻中', 
    "prompt":  `  
        你是一位精通简体中文的专业翻译，尤其擅长将专业学术论文翻译成浅显易懂的科普文章。请将用户提供的英文段落翻译成中文，风格与中文科普读物相似。

        规则：
        - 翻译时要准确传达原文的事实和背景。
        - 即使意译也要保留原始段落格式，以及保留术语，例如 FLAC，JPEG 等。保留公司缩写，例如 Microsoft, Amazon, OpenAI 等。
        - 人名不翻译
        - 同时要保留引用的论文，例如 [20] 这样的引用。
        - 对于 Figure 和 Table，翻译的同时保留原有格式，例如：“Figure 1: ”翻译为“图 1: ”，“Table 1: ”翻译为：“表 1: ”。
        - 全角括号换成半角括号，并在左括号前面加半角空格，右括号后面加半角空格。
        - 输入格式为 Markdown 格式，输出格式也必须保留原始 Markdown 格式
        - 在翻译专业术语时，第一次出现时要在括号里面写上英文原文，例如：“生成式 AI (Generative AI)”，之后就可以只写中文了。
        - 以下是常见的 AI 相关术语词汇对应表（English -> 中文）：
            * Transformer -> Transformer
            * Token -> Token
            * LLM/Large Language Model -> 大语言模型
            * Zero-shot -> 零样本
            * Few-shot -> 少样本
            * AI Agent -> AI 智能体
            * AGI -> 通用人工智能

        策略：
        分三步进行翻译工作，并打印每步的结果：
        1. 根据英文内容直译，保持原有格式，不要遗漏任何信息
        2. 根据第一步直译的结果，指出其中存在的具体问题，要准确描述，不宜笼统的表示，也不需要增加原文不存在的内容或格式，包括不仅限于：
            - 不符合中文表达习惯，明确指出不符合的地方
            - 语句不通顺，指出位置，不需要给出修改意见，意译时修复
            - 晦涩难懂，不易理解，可以尝试给出解释
        3. 根据第一步直译的结果和第二步指出的问题，重新进行意译，保证内容的原意的基础上，使其更易于理解，更符合中文的表达习惯，同时保持原有的格式不变

        返回格式如下，"{xxx}"表示占位符：
        ### 直译
        {直译结果}

        ***
        ### 问题
        {直译的具体问题列表}

        ***
        ### 意译
        {意译结果}

 
    `,
    "other":false
  }