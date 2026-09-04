/** 四个维度：重口↔清淡 / 独食↔拼桌 / 尝新↔守旧 / 快节奏↔仪式感 */
export type Flavor = 'bold' | 'mild'
export type Social = 'solo' | 'social'
export type Explore = 'novel' | 'classic'
export type Pace = 'fast' | 'slow'

export type PersonaKey = `${Flavor}-${Social}-${Explore}-${Pace}`
export type Axis = 'flavor' | 'social' | 'explore' | 'pace'

export interface Question {
  q: string
  /** A 选项（对应维度的第一个特质） */
  a: string
  /** B 选项（对应维度的第二个特质） */
  b: string
  axis: Axis
}

/** 8 道题：每个维度 2 道（同维度内平票时，第一题的答案决定） */
export const QUESTIONS: Question[] = [
  { axis: 'flavor', q: '加班到晚上九点，此刻的胃想要？', a: '重油重辣，狠狠报复一天', b: '清汤寡水，温柔安抚灵魂' },
  { axis: 'flavor', q: '点辣度时的你？', a: '特辣！辣到灵魂出窍才痛快', b: '微辣就好，意思一下' },
  { axis: 'social', q: '午休只有自己，你会？', a: '一个人安静炫饭，享受独处', b: '拉个同事拼桌吐槽才香' },
  { axis: 'social', q: '火锅局上你最在意？', a: '我那碟蘸料必须完美', b: '大家抢成一团才叫热闹' },
  { axis: 'explore', q: '楼下新开了家没听过的融合菜馆？', a: '冲！猎奇是干饭人的浪漫', b: '算了，老几样保平安' },
  { axis: 'explore', q: '菜单上有一道从没见过的菜？', a: '就它了，没吃过的都想试', b: '永远的神只有红烧肉' },
  { axis: 'pace', q: '只有 15 分钟干饭时间？', a: '外卖速战速决，效率至上', b: '再赶也要摆好盘再吃' },
  { axis: 'pace', q: '周末晚餐的态度？', a: '随便对付一口得了', b: '仪式感拉满，慢慢享用' },
]

export interface Persona {
  key: PersonaKey
  emoji: string
  title: string
  /** 本命食物 */
  food: string
  /** 天赋技能 */
  skill: string
  /** 致命弱点 */
  weakness: string
  /** 最佳饭搭子（人格 key） */
  partnerKey: PersonaKey
  /** 一句话点评 */
  comment: string
}

const P = (
  key: PersonaKey,
  emoji: string,
  title: string,
  food: string,
  skill: string,
  weakness: string,
  partnerKey: PersonaKey,
  comment: string,
): Persona => ({ key, emoji, title, food, skill, weakness, partnerKey, comment })

export const PERSONAS: Record<PersonaKey, Persona> = {
  'bold-solo-novel-fast': P('bold-solo-novel-fast', '🐺', '荒野觅食狼', '麻辣香锅（全荤单人份）',
    '一个人也敢点三个菜', '没人拦着你，永远点多了', 'mild-solo-novel-slow',
    '干饭界的独行侠，辣是你的铠甲。'),
  'bold-solo-novel-slow': P('bold-solo-novel-slow', '🌙', '深夜食堂主', '自热小火锅加豪华配料',
    '把独居日子吃出烟火气', '吃完自己洗碗', 'mild-social-classic-slow',
    '一个人，也要好好吃饭。'),
  'bold-solo-classic-fast': P('bold-solo-classic-fast', '⚡', '麻辣快枪手', '隆江猪脚饭（加卤蛋）',
    '从下单到炫完只要 8 分钟', '常去的那家店老板已经记住你', 'mild-social-classic-fast',
    '效率与激情并存的干饭机器。'),
  'bold-solo-classic-slow': P('bold-solo-classic-slow', '🥷', '重口隐士', '螺蛳粉加臭豆腐',
    '一身"香味"即是结界', '电梯里同事的眼神', 'mild-solo-classic-slow',
    '独享重口，是至高的自由。'),
  'bold-social-novel-fast': P('bold-social-novel-fast', '📢', '干饭局组织者', '麻辣小龙虾（社交剥壳版）',
    '新店探店从不踩雷', '月底的钱包', 'mild-social-novel-slow',
    '哪里有新店，哪里就有你。'),
  'bold-social-novel-slow': P('bold-social-novel-slow', '👑', '宴席之王', '火锅涮毛肚',
    '"七上八下"终极奥义掌握者', '手慢抢不过别人', 'mild-solo-novel-slow',
    '饭桌就是你的主场，锅气就是你的王气。'),
  'bold-social-classic-fast': P('bold-social-classic-fast', '🤝', '拼单闪电侠', '黄焖鸡米饭（四人拼单版）',
    '凑满减的数学天才', '口味总被"少数服从多数"', 'mild-social-novel-fast',
    '从众，但吃得很好。'),
  'bold-social-classic-slow': P('bold-social-classic-slow', '🍖', '老饕饭局魂', '潮汕牛肉火锅',
    '全城老馆子都有你的熟客价', '对新店过敏', 'mild-social-novel-slow',
    '传统重口的最后守护者。'),
  'mild-solo-novel-fast': P('mild-solo-novel-fast', '🥗', '轻食急行军', '便利店饭团配无糖茶',
    '健康与效率的平衡大师', '深夜会报复性点炸鸡', 'bold-solo-novel-fast',
    '自律，但有限。'),
  'mild-solo-novel-slow': P('mild-solo-novel-slow', '🍵', '清汤诗人', '日料定食',
    '一人食吃出茶道感', '被同事吐槽"装"', 'bold-solo-novel-fast',
    '清淡，是你的态度不是你的极限。'),
  'mild-solo-classic-fast': P('mild-solo-classic-fast', '🍚', '白粥闪电侠', '食堂两荤一素',
    '15 分钟吃完还能午睡半小时', '生活缺乏惊喜', 'bold-social-classic-fast',
    '稳定，压倒一切。'),
  'mild-solo-classic-slow': P('mild-solo-classic-slow', '⛰️', '养生隐居客', '番茄盖浇饭（少油版）',
    '吃了三年外卖体重不变', '火锅局只能涮青菜', 'bold-solo-classic-slow',
    '平平淡淡，才是真。'),
  'mild-social-novel-fast': P('mild-social-novel-fast', '🐦', '猎奇小清新', '冬阴功锅',
    '带朋友尝鲜又不会翻车', '点菜选择困难症', 'bold-social-novel-fast',
    '清淡派的冒险家。'),
  'mild-social-novel-slow': P('mild-social-novel-slow', '📸', '探店品鉴官', '创意融合菜',
    '拍照修图发圈一条龙', '照片拍完，菜凉了', 'bold-social-classic-slow',
    '先让手机吃，是对食物的尊重。'),
  'mild-social-classic-fast': P('mild-social-classic-fast', '🥢', '食堂社交家', '食堂窗口加拼桌',
    '知道哪个窗口阿姨手不抖', '离开食堂就迷路', 'bold-social-classic-fast',
    '性价比之交，淡如水但管饱。'),
  'mild-social-classic-slow': P('mild-social-classic-slow', '🏠', '家常饭搭子', '外婆做的饭',
    '一桌人因你而聚齐', '饭后洗碗的是你', 'bold-solo-novel-slow',
    '人间至味是团圆。'),
}

/** 人设卡主色调（按重口/清淡） */
export function personaAccent(persona: Persona): string {
  return persona.key.startsWith('bold') ? '#ff8a5e' : '#5effc3'
}
