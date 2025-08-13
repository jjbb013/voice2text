import type { ExecutionContext } from '@cloudflare/workers-types';

function isFile(value: any): value is File {
  return value instanceof (globalThis as any).File;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return new Response('Expected POST request', { status: 405 });
      }

      const formData = await request.formData();
      const audioFile = formData.get('audio');

      if (!isFile(audioFile)) {
        return new Response('No audio file uploaded or the uploaded item is not a file.', { status: 400 });
      }

      const audioArrayBuffer = await audioFile.arrayBuffer();

      const response = await env.AI.run(
        '@cf/openai/whisper',
        {
          audio: [...new Uint8Array(audioArrayBuffer)],
          prompt: "健身, 训练, 俯卧撑, 引体向上, 杠铃卧推, 哑铃卧推, 深蹲, 硬拉, 划船, 卧推, 飞鸟, 弯举, 臂屈伸, 卷腹, 平板支撑, 负重, 公斤, 磅, 次, 组, 个, RM, PR, 胸肌, 背肌, 肩膀, 手臂, 二头肌, 三头肌, 腹肌, 核心, 腿, 股四头肌, 腘绳肌, 组间休息, 热身, 拉伸, 有氧, 无氧"
        }
      );

      if (response.text) {
        let correctedText = toSimplified(response.text);
        correctedText = correctSportsTerms(correctedText);
        response.text = correctedText;
      }

      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
};

// A simple function to convert Traditional Chinese to Simplified Chinese
// This is not a comprehensive solution but covers common cases.
function toSimplified(traditionalText: string): string {
  const mapping: { [key: string]: string } = {
    '剛剛': '刚刚', '個': '个', '飲': '饮', '體': '体', '嚮': '向', '상': '上', '副': '副', '重': '重', '公斤': '公斤',
    '臺灣': '台湾', '臺北': '台北', '憂鬱': '忧郁', '發': '发', '見': '见', '無': '无', '實': '实', '際': '际',
    '塵': '尘', '廣': '广', '點': '点', '齊': '齐', '齋': '斋', '擊': '击', '幾': '几', '盤': '盘',
    '禮': '礼', '節': '节', '塊': '块', '師': '师', '帶': '带', '麼': '么', '麽': '么', '瞭': '了', '於': '于',
    '製': '制', '隻': '只', '週': '周', '颱': '台', '颱風': '台风', '裡': '里', '麵': '面', '鞦韆': '秋千',
    '韆': '千', '鞦': '秋', '老闆': '老板', '闆': '板', '瀋': '沈', '陽': '阳', '瀋陽': '沈阳',
    '話': '话', '語': '语', '電': '电', '龍': '龙', '頭': '头', '車': '车', '輛': '辆', '輪': '轮', '軟': '软',
    '體的': '体的', '書': '书', '會': '会', '雲': '云', '動': '动', '開': '开', '關': '关',
    '蘋': '苹', '果': '果', '亞': '亚', '馬': '马', '遜': '逊', '微': '微', '穀': '谷',
    '歌': '歌', '臉': '脸', '網': '网', '飛': '飞', '愛': '爱', '彼': '彼', '迎': '迎', '優': '优',
    '步': '步', '級': '级', '維': '维', '基': '基', '百': '百', '科': '科', '葉': '叶', '機': '机', '構': '构',
    '僕': '仆', '僕人': '仆人', '奮': '奋', '鬥': '斗', '奮鬥': '奋斗', '聽': '听', '說': '说', '讀': '读',
    '寫': '写', '畫': '画', '圖': '图', '黃': '黄', '紅': '红', '藍': '蓝', '綠': '绿', '紫': '紫', '黑': '黑',
    '白': '白', '銀': '银', '金': '金', '鐵': '铁', '鋼': '钢', '銅': '铜', '鋁': '铝', '錫': '锡', '鉛': '铅',
    '鋅': '锌', '鎳': '镍', '鈦': '钛', '鋰': '锂', '鈉': '钠', '鉀': '钾', '鈣': '钙', '鎂': '镁', '氫': '氢',
    '氧': '氧', '氮': '氮', '碳': '碳', '硫': '硫', '磷': '磷', '硅': '硅', '氯': '氯', '氬': '氩', '氖': '氖',
    '氦': '氦', 'Krypton': '氪', '氙': '氙', '氡': '氡', '鐳': '镭', '鈾': '铀', '鈈': '钚', '鎄': '锿',
    '鐨': '镄', '鍆': '钔', '諾': '诺', 'Nobelium': '锘', '鐒': '铹', 'Rutherfordium': '卢', 'Dubnium': '杜',
    'Seaborgium': '𨭎', 'Bohrium': '波', 'Hassium': '黑', 'Meitnerium': '䥑', 'Darmstadtium': '鐽',
    'Roentgenium': '伦', 'Copernicium': '哥', 'Nihonium': '鉨', 'Flerovium': '鈇',
    'Moscovium': '镆', 'Livermorium': '鉝', 'Tennessine': 'Ts', 'Oganesson': 'Og'
  };

  let simplifiedText = traditionalText;
  for (const [traditional, simplified] of Object.entries(mapping)) {
    simplifiedText = simplifiedText.replace(new RegExp(traditional, 'g'), simplified);
  }
  return simplifiedText;
}

function correctSportsTerms(text: string): string {
  const corrections: { [key: string]: string } = {
    '饮体向上': '引体向上',
    '俯卧撑': '俯卧撑', // 确保正确的词也被覆盖，以防万一
    '杠铃卧推': '杠铃卧推',
    '哑铃卧推': '哑铃卧推',
    // 在这里可以添加更多常见的错误识别和对应的正确术语
  };

  let correctedText = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    correctedText = correctedText.replace(new RegExp(wrong, 'g'), correct);
  }
  return correctedText;
}

interface Env {
  AI: any;
}
