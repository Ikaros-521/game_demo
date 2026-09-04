import type { Rarity } from './rarity'

export interface Food {
  id: string
  name: string
  emoji: string
  rarity: Rarity
}

export const FOODS: Food[] = [
  // ── N · 日常口粮 ──────────────────────────
  { id: 'shaxian', name: '沙县拌面加炖罐', emoji: '🍜', rarity: 'N' },
  { id: 'lanzhou', name: '兰州牛肉面', emoji: '🍜', rarity: 'N' },
  { id: 'canteen', name: '食堂两荤一素', emoji: '🍱', rarity: 'N' },
  { id: 'instant-noodle', name: '泡面卧个蛋', emoji: '🍲', rarity: 'N' },
  { id: 'rice-ball', name: '便利店饭团', emoji: '🍙', rarity: 'N' },
  { id: 'fried-rice', name: '黄金蛋炒饭', emoji: '🍳', rarity: 'N' },
  { id: 'xiaomian', name: '重庆小面', emoji: '🌶️', rarity: 'N' },
  { id: 'dumpling', name: '水饺蘸醋', emoji: '🥟', rarity: 'N' },
  { id: 'shouzhuabing', name: '手抓饼加蛋', emoji: '🌯', rarity: 'N' },
  { id: 'gaiziaofan', name: '番茄盖浇饭', emoji: '🍚', rarity: 'N' },

  // ── R · 小确幸 ────────────────────────────
  { id: 'malatang', name: '麻辣烫', emoji: '🍢', rarity: 'R' },
  { id: 'huangmoji', name: '黄焖鸡米饭', emoji: '🍗', rarity: 'R' },
  { id: 'luosifen', name: '螺蛳粉', emoji: '🐌', rarity: 'R' },
  { id: 'jianbing', name: '煎饼果子', emoji: '🥞', rarity: 'R' },
  { id: 'fried-chicken', name: '炸鸡配可乐', emoji: '🍗', rarity: 'R' },
  { id: 'suancaiyu', name: '酸菜鱼', emoji: '🐟', rarity: 'R' },
  { id: 'bibimbap', name: '石锅拌饭', emoji: '🥘', rarity: 'R' },
  { id: 'zhujiaofan', name: '隆江猪脚饭', emoji: '🍖', rarity: 'R' },
  { id: 'xiangguo', name: '麻辣香锅', emoji: '🌶️', rarity: 'R' },
  { id: 'burger', name: '汉堡薯条', emoji: '🍔', rarity: 'R' },

  // ── SR · 干饭人高光 ────────────────────────
  { id: 'hotpot', name: '火锅涮毛肚', emoji: '🍲', rarity: 'SR' },
  { id: 'yakiniku', name: '炭火烤肉', emoji: '🥩', rarity: 'SR' },
  { id: 'teishoku', name: '日料定食', emoji: '🍣', rarity: 'SR' },
  { id: 'crayfish', name: '麻辣小龙虾', emoji: '🦞', rarity: 'SR' },
  { id: 'bbq', name: '烧烤大串', emoji: '🍢', rarity: 'SR' },
  { id: 'beef-hotpot', name: '潮汕牛肉锅', emoji: '🐂', rarity: 'SR' },
  { id: 'tom-yum', name: '冬阴功锅', emoji: '🍤', rarity: 'SR' },
  { id: 'lamb-spine', name: '羊蝎子火锅', emoji: '🐑', rarity: 'SR' },

  // ── SSR · 今日天选 ────────────────────────
  { id: 'wagyu', name: '和牛放题', emoji: '🥩', rarity: 'SSR' },
  { id: 'seafood', name: '海鲜大餐', emoji: '🦀', rarity: 'SSR' },
  { id: 'michelin', name: '米其林摘星', emoji: '🍽️', rarity: 'SSR' },
  { id: 'grandma', name: '外婆做的饭', emoji: '❤️', rarity: 'SSR' },
  { id: 'buffet', name: '自助餐全款拿下', emoji: '🎉', rarity: 'SSR' },
]

/** 宜：干饭加分项 */
export const GOOD_THINGS: string[] = [
  '加个蛋',
  '多放辣',
  '配杯奶茶',
  '多添一碗饭',
  '就着下饭综艺吃',
  '喊上饭搭子',
  '吃完散步消食',
  '大口吃，别玩手机',
]

/** 忌：干饭避雷项 */
export const BAD_THINGS: string[] = [
  '轻食沙拉，你会后悔的',
  '不吃早饭',
  '外卖到了先拍照，凉了',
  '边走边吃',
  '发朋友圈，会被约饭',
  '减肥，这事明天再说',
  '吃太快，胃会抗议',
  '纠结，纠结就输了',
]

/** 点评：按稀有度分层 */
export const COMMENTS: Record<Rarity, string[]> = {
  N: [
    '运势平平，干饭从简，省钱才是硬道理。',
    '平平淡淡才是真，加个蛋已是今日上限。',
    '干饭如白开水，管饱但别指望惊喜。',
    '今日宜认命，食堂阿姨手不抖就算赢。',
  ],
  R: [
    '小确幸预警！今天值得多干一碗。',
    '运势尚可，干饭幸福感稳定在线。',
    '打工人回血套餐，吃完原地复活。',
  ],
  SR: [
    '干饭人高光时刻！同事投来羡慕的目光。',
    '运势火热！这一顿值得拍照发圈。',
    '今日干饭天花板，建议喊上饭搭子。',
  ],
  SSR: [
    '天选干饭人！今日不干对不起这张签。',
    '史诗级干饭运势！错过再等一年。',
    '运势拉满！建议立刻马上安排。',
  ],
}
