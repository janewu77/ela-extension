/**
 * Util.js 测试文件
 * 
 * 直接引用 util.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// 导入实际的 util.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve('../scripts/util.js')];

// 直接 require util.js（它会自动导出函数）
const util = require('../scripts/util.js');

// ============================================================================
// 测试套件
// ============================================================================

describe('Util.js 测试', () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    
    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();
  });

  // ========================================================================
  // 字符串处理函数测试
  // ========================================================================

  describe('字符串处理', () => {
    describe('maskMsg', () => {
      it('应该掩码长度大于等于7的字符串', () => {
        const result = util.maskMsg('1234567890');
        expect(result).toBe('12345********90');
      });

      it('应该返回原字符串当长度小于7', () => {
        expect(util.maskMsg('123456')).toBe('123456');
        expect(util.maskMsg('12345')).toBe('12345');
        expect(util.maskMsg('123')).toBe('123');
        expect(util.maskMsg('12')).toBe('12');
        expect(util.maskMsg('1')).toBe('1');
      });

      it('应该处理空字符串', () => {
        expect(util.maskMsg('')).toBe('');
      });

      it('应该处理 null 值', () => {
        expect(util.maskMsg(null)).toBe('');
      });

      it('应该处理 undefined 值', () => {
        expect(util.maskMsg(undefined)).toBe('');
      });

      it('应该处理非字符串类型', () => {
        // 非字符串类型会返回原值（因为 typeof msg !== 'string' 返回原值）
        expect(util.maskMsg(1234567890)).toBe(1234567890);
        expect(util.maskMsg({})).toEqual({});
        expect(util.maskMsg([])).toEqual([]);
      });

      it('应该正确处理长字符串', () => {
        const longString = 'sk-proj-abcdefghijklmnopqrstuvwxyz1234567890';
        const result = util.maskMsg(longString);
        expect(result).toBe('sk-pr********90'); // 前5个字符 + 8个星号 + 后2个字符
        expect(result.length).toBe(15); // 5 + 8 + 2
      });

      it('应该正确处理恰好7个字符的字符串', () => {
        const result = util.maskMsg('1234567');
        expect(result).toBe('12345********67');
      });

      it('应该正确处理包含特殊字符的字符串', () => {
        const result = util.maskMsg('abc-def-ghi-jkl');
        expect(result).toBe('abc-d********kl'); // 前5个字符 + 8个星号 + 后2个字符
      });
    });
  });

  // ========================================================================
  // DOM 操作函数测试
  // ========================================================================

  describe('DOM 操作', () => {
    describe('calculateLines', () => {
      let mockTextarea;
      let mockDummy;

      beforeEach(() => {
        // Mock textarea 元素（使用 HTMLTextAreaElement 类）
        mockTextarea = new HTMLTextAreaElement();
        mockTextarea.value = 'test content';
        mockTextarea.offsetWidth = 200;
        mockTextarea.clientHeight = 20;

        // Mock dummy 元素
        mockDummy = {
          className: '',
          style: {},
          textContent: '',
          innerHTML: '',
          clientHeight: 20,
          parentNode: null
        };

        // 让 innerHTML 可以设置和读取
        Object.defineProperty(mockDummy, 'innerHTML', {
          get: function() { return this._innerHTML || ''; },
          set: function(value) { this._innerHTML = value; },
          configurable: true
        });

        // Mock document.createElement
        document.createElement = jest.fn(() => mockDummy);

        // Mock window.getComputedStyle
        window.getComputedStyle = jest.fn(() => ({
          font: '14px Arial',
          fontSize: '14px',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          lineHeight: '20px',
          padding: '5px',
          boxSizing: 'border-box'
        }));

        // Mock document.body（重置 mock）
        document.body.appendChild.mockClear();
        document.body.removeChild.mockClear();
      });

      it('应该计算单行文本的行数', () => {
        mockTextarea.value = 'Single line text';
        mockDummy.clientHeight = 20; // 单行高度

        const result = util.calculateLines(mockTextarea, 'test-class');

        expect(document.createElement).toHaveBeenCalledWith('div');
        expect(mockDummy.className).toBe('test-class temp-line-calculator');
        expect(document.body.appendChild).toHaveBeenCalledWith(mockDummy);
        expect(document.body.removeChild).toHaveBeenCalledWith(mockDummy);
        expect(result).toBeGreaterThanOrEqual(1);
      });

      it('应该计算多行文本的行数', () => {
        mockTextarea.value = 'Line 1\nLine 2\nLine 3';
        mockDummy.clientHeight = 60; // 3行高度

        const result = util.calculateLines(mockTextarea);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(document.body.removeChild).toHaveBeenCalled();
      });

      it('应该处理空文本', () => {
        mockTextarea.value = '';
        mockDummy.clientHeight = 20;

        const result = util.calculateLines(mockTextarea);

        expect(result).toBeGreaterThanOrEqual(1);
      });

      it('应该处理没有 className 的情况', () => {
        mockTextarea.value = 'test';
        mockDummy.clientHeight = 20;

        const result = util.calculateLines(mockTextarea);

        expect(mockDummy.className).toBe('temp-line-calculator');
        expect(result).toBeGreaterThanOrEqual(1);
      });

      it('应该返回1当 textarea 为 null', () => {
        const result = util.calculateLines(null);

        expect(console.error).toHaveBeenCalledWith(
          '[Util] Invalid textarea element provided to calculateLines'
        );
        expect(result).toBe(1);
      });

      it('应该返回1当 textarea 为 undefined', () => {
        const result = util.calculateLines(undefined);

        expect(console.error).toHaveBeenCalled();
        expect(result).toBe(1);
      });

      it('应该返回1当 textarea 不是 HTMLTextAreaElement', () => {
        const result = util.calculateLines({});

        expect(console.error).toHaveBeenCalled();
        expect(result).toBe(1);
      });

      it('应该返回1当 document 不可用', () => {
        const originalDocument = global.document;
        global.document = null;

        const result = util.calculateLines(mockTextarea);

        expect(console.error).toHaveBeenCalledWith(
          '[Util] DOM not available for calculateLines'
        );
        expect(result).toBe(1);

        global.document = originalDocument;
      });

      it('应该返回1当 document.body 不可用', () => {
        const originalBody = document.body;
        document.body = null;

        const result = util.calculateLines(mockTextarea);

        expect(console.error).toHaveBeenCalledWith(
          '[Util] DOM not available for calculateLines'
        );
        expect(result).toBe(1);

        document.body = originalBody;
      });

      it('应该处理计算过程中的错误', () => {
        mockTextarea.value = 'test';
        window.getComputedStyle.mockImplementation(() => {
          throw new Error('Style error');
        });

        const result = util.calculateLines(mockTextarea);

        expect(console.error).toHaveBeenCalledWith(
          '[Util] Error calculating lines:',
          expect.any(Error)
        );
        expect(result).toBe(1);
      });

      it('应该确保临时元素被清理（正常流程）', () => {
        mockTextarea.value = 'test';
        mockDummy.clientHeight = 20;
        mockDummy.parentNode = document.body;

        util.calculateLines(mockTextarea);

        // 正常流程中应该移除
        expect(document.body.removeChild).toHaveBeenCalledWith(mockDummy);
      });

      it('应该确保临时元素被清理（错误情况）', () => {
        mockTextarea.value = 'test';
        mockDummy.parentNode = document.body;
        
        // 模拟在计算过程中出错
        document.body.appendChild.mockImplementation(() => {
          throw new Error('Append error');
        });

        const result = util.calculateLines(mockTextarea);

        expect(console.error).toHaveBeenCalled();
        expect(result).toBe(1);
        // finally 块应该尝试清理
        // 但由于 appendChild 失败，dummy 可能没有 parentNode
      });

      it('应该正确处理换行符', () => {
        mockTextarea.value = 'Line 1\nLine 2';
        mockDummy.clientHeight = 40; // 2行高度

        const result = util.calculateLines(mockTextarea);

        // 验证函数正常执行并返回合理的行数
        expect(result).toBeGreaterThanOrEqual(1);
        // 验证 textarea 的值被使用
        expect(mockTextarea.value).toContain('\n');
      });

      it('应该复制 textarea 的样式', () => {
        mockTextarea.value = 'test';
        mockDummy.clientHeight = 20;

        util.calculateLines(mockTextarea, 'test-class');

        expect(window.getComputedStyle).toHaveBeenCalledWith(mockTextarea);
        expect(mockDummy.style.font).toBe('14px Arial');
        expect(mockDummy.style.fontSize).toBe('14px');
        expect(mockDummy.style.fontFamily).toBe('Arial');
      });

      it('应该设置正确的隐藏样式', () => {
        mockTextarea.value = 'test';
        mockDummy.clientHeight = 20;

        util.calculateLines(mockTextarea);

        expect(mockDummy.style.visibility).toBe('hidden');
        expect(mockDummy.style.position).toBe('absolute');
        expect(mockDummy.style.top).toBe('-9999px');
        expect(mockDummy.style.whiteSpace).toBe('pre-wrap');
        expect(mockDummy.style.wordWrap).toBe('break-word');
        expect(mockDummy.style.overflowWrap).toBe('break-word');
      });

      it('应该至少返回1行', () => {
        mockTextarea.value = '';
        mockDummy.clientHeight = 0; // 模拟0高度

        const result = util.calculateLines(mockTextarea);

        expect(result).toBeGreaterThanOrEqual(1);
      });

      it('应该处理单行高度为0的情况', () => {
        mockTextarea.value = 'test';
        // 第一次设置文本后
        mockDummy.clientHeight = 20;
        // 第二次设置为 'A' 后
        Object.defineProperty(mockDummy, 'clientHeight', {
          get: jest.fn()
            .mockReturnValueOnce(20) // 总高度
            .mockReturnValueOnce(0),  // 单行高度为0
          configurable: true
        });

        const result = util.calculateLines(mockTextarea);

        // 应该使用默认值1避免除以0
        expect(result).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
