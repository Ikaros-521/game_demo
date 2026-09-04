# 干饭游戏大全 🍚

「今天吃什么」小游戏合集——玩一局，答案就有了。纯前端、纯本地运行、**零外部素材**（全部 emoji + CSS 代码绘制），PC / 手机双端自适应。

## 四款玩法

| 游戏 | 路由 | 玩法 |
|---|---|---|
| 🎴 干饭运势签 | `#/fortune` | 三选一翻牌抽卡，N/R/SR/SSR 稀有度 + 全 N 保底，SSR 全屏爆发特效 |
| ⚡ 极速淘汰赛 | `#/elimination` | 10 秒点掉不想吃的，剩下什么吃什么；剩多个触发轮盘决胜，全删光有特别结局 |
| 🎭 干饭人格测试 | `#/personality` | 8 道二选一（4 维度），解锁 16 种干饭人设卡（本命/天赋/弱点/饭搭子） |
| 🥣 天降干饭 | `#/catch` | 30 秒接食物街机：鼠标/方向键/触控移动碗，掉落按稀有度加权，接最多的是什么今天就吃什么 |

每局结果都可一键保存 PNG 分享。

## 在线访问

推送到 `main` 自动触发 GitHub Actions（测试 → 构建 → 部署）：

**https://game.ikaros.dpdns.org/**（自定义域名，主入口）

<https://ikaros-521.github.io/game_demo/> 会 301 跳转到上面的域名。

## 本地运行

```bash
pnpm install
pnpm dev        # 开发
pnpm test       # 单元测试（30 个：概率/保底/结算/人格映射等纯逻辑）
pnpm build      # 构建（产物 dist/，可静态部署）
```

## 结构

```
src/
├── App.tsx              # HashRouter 路由（Pages 子路径免配置）
├── pages/Hub.tsx        # 游戏大全首页
├── components/          # 公共：StarField 背景 / GameShell 页壳
├── lib/useSaveImage.ts  # 公共：结果卡保存 PNG
└── games/               # 每款游戏 = 纯逻辑(game/) + UI(index.tsx) + 单测
    ├── fortune/         #   A 运势签（data/rarity/fortune/useDraw + 5 个组件）
    ├── elimination/     #   B 极速淘汰赛
    ├── personality/     #   C 干饭人格测试（16 人设数据）
    └── catch/           #   D 天降干饭（rAF 物理循环）
```

约定：游戏规则逻辑全部收敛在各游戏 `game.ts` 纯函数（可注入 rand 做确定性单测），组件层只做展示与动画编排。

- 设计文档：`docs/specs/2026-09-04-ganfan-fortune-design.md`
- 开发复盘（AI 做页游的问题记录）：`docs/dev-log.md`
- 验收截图：`docs/shots/`
