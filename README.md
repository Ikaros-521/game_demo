# 干饭运势签 🍚

「今天吃什么」做成日式抽卡：三张干饭签凭直觉翻一张，翻开今日干饭运势卡——吃什么、运势几星、宜什么忌什么，可保存成图片分享。

- 纯前端、纯本地抽签、**零外部素材**（全部 emoji + CSS 代码绘制）
- 稀有度：N 55% / R 30% / SR 12% / SSR 3%（含保底：三张全 N 强制升级一张 R+）
- PC / 手机双端自适应（手机优先，PC 居中画幅）

## 运行

```bash
pnpm install
pnpm dev        # 开发
pnpm test       # 单元测试（概率 / 保底 / 运势组装）
pnpm build      # 构建（产物在 dist/，可静态部署）
```

## 在线访问

推送到 `master` 会自动触发 GitHub Actions（测试 → 构建 → 部署）：

**https://ikaros-521.github.io/game_demo/**

## 结构

```
src/
├── game/            # 纯逻辑层（可单测）
│   ├── data.ts      #   食物库 + 宜/忌/点评文案库
│   ├── rarity.ts    #   稀有度概率 + 三张签生成 + 保底
│   ├── fortune.ts   #   运势组装（星级/宜忌/点评）
│   └── useDraw.ts   #   状态机 hook: idle→dealing→picking→revealing→result
└── components/      # 展示层
    ├── StartScreen / CardTable / FortuneCard
    ├── ResultPanel  #   运势卡 + 保存图片（html-to-image）
    ├── SSRBurst     #   SSR 全屏特效
    └── StarField    #   星光 + 樱花背景（CSS 动画）
```

- 设计文档：`docs/specs/2026-09-04-ganfan-fortune-design.md`
- 开发复盘（AI 做页游遇到的问题记录）：`docs/dev-log.md`
- 验收截图：`docs/shots/`
