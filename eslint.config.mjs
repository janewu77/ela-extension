// ESLint 配置文件
// 适用于 Chrome Extension 项目

import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  // 推荐规则
  js.configs.recommended,
  
  // 全局配置
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // Chrome Extension APIs
        chrome: 'readonly',
        browser: 'readonly',
        // 浏览器环境
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        Headers: 'readonly', // Fetch API Headers
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        HTMLTextAreaElement: 'readonly',
        self: 'readonly',
        // Node.js 环境（用于测试）
        global: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Jest 测试环境
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        // 浏览器和 Node.js 通用
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // 从 const.js 加载的全局常量
        debug: 'readonly',
        defaultOnoff: 'readonly',
        default_auth_token: 'readonly',
        default_tts_endpoint: 'readonly',
        default_tts_model: 'readonly',
        default_tts_voice: 'readonly',
        arrTTSModel: 'readonly',
        arrTTSVoice: 'readonly',
        default_chat_endpoint: 'readonly',
        default_chat_model: 'readonly',
        arrChatModel: 'readonly',
        default_action_items: 'readonly',
        // 从其他脚本文件加载的全局变量
        maskMsg: 'readonly',
        calculateLines: 'readonly',
        createButton: 'readonly',
        ClassNameForTxtAreaButton: 'readonly',
        SVGLoadingSpin: 'readonly',
        mapMsg: 'readonly',
        fetchChat: 'readonly',
        streamResponseRead: 'readonly',
        getBtnSetting: 'readonly',
        add_content_block: 'readonly',
        createCustomPannel: 'readonly',
        fetchAudio: 'readonly',
        api_endpoint: 'readonly',
        version: 'writable',
        current_tts_endpoint: 'writable',
        current_tts_model: 'writable',
        current_tts_voice: 'readonly',
        current_auth_token: 'writable',
        current_chat_endpoint: 'readonly',
        current_chat_model: 'readonly',
        current_action_items_active: 'readonly',
        // SVG 图标（从 icons.js 加载）
        SVGSetting_6: 'readonly',
        SVGSetting: 'readonly',
        SVGDeleteAll_6: 'readonly',
        SVGDelete_light: 'readonly',
        SVGCopy_light: 'readonly',
        SVGClose_light: 'readonly',
        SVGPlay: 'readonly',
        SVGPause: 'readonly',
        SVGStop: 'readonly',
        SVGEdit: 'readonly',
        SVGCheck: 'readonly',
        SVGCheckDisabled: 'readonly',
      },
    },
    
    plugins: {
      prettier,
    },
    
    rules: {
      // Prettier 集成
      'prettier/prettier': 'error',
      
      // 代码质量规则
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off', // 允许 console（调试用）
      'no-debugger': 'warn',
      'no-alert': 'warn',
      
      // 最佳实践
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      
      // 代码风格（由 Prettier 处理，这里只做兜底）
      semi: 'off', // Prettier 会处理
      quotes: 'off', // Prettier 会处理
      indent: 'off', // Prettier 会处理
    },
  },
  
  // 针对特定文件的规则
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    rules: {
      'no-unused-vars': 'off', // 测试中允许未使用的变量
    },
  },
  
  // const.js 文件特殊处理（全局常量，会被其他文件使用）
  {
    files: ['**/const.js'],
    rules: {
      'no-unused-vars': 'off', // 全局常量会被其他文件使用
    },
  },
  
  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.parcel-cache/**',
      '**/*.min.js',
      '**/marked.min.js',
      'archive/**',
      // 生成的 CSS 文件（由 Tailwind CSS 生成，不需要 lint）
      'src/css/main.css',
    ],
  },
];
