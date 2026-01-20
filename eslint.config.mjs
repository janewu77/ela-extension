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
      '*.min.js',
      'archive/**',
    ],
  },
];
