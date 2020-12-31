---
home: true

hero:
  title: trn cli
  desc: 基于 潭州开发规范 快速创建项目,构建项目等脚手架
  actions:
    - text: 快速上手
      link: /guide

features:
  - title: 功能丰富
    desc: trn-cli会提供多套模版, 模版内置了路由、构建、部署、测试等，仅需一个依赖即可上手开发。并且还可以做成插件集，内涵丰富的功能，可满足日常 80% 的开发需求。
    icon: https://gw.alipayobjects.com/zos/basement_prod/a1c647aa-a410-4024-8414-c9837709cb43/k7787itw_w126_h114.png

  - title: 无需 Eject
    desc: 完全是可配置的，无需 eject。这样你的项目就可以长期保持更新了。
    icon: https://gw.alipayobjects.com/zos/basement_prod/b54b48c7-087a-4984-b150-bcecb40920de/k7787z07_w114_h120.png

  - title: 面向未来
    desc: 在满足需求的同时，我们也不会停止对新技术的探索。比如 modern mode、webpack@5、自动化化 external、bundler less 等等。
    icon: https://gw.alipayobjects.com/zos/basement_prod/d078a5a9-1cb3-4352-9f05-505c2e98bc95/k7788v4b_w102_h126.png

footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self
---

## 起步

安装：

```bash
npm install -g @tzfe/trn-cli --registry=http://nexus.tanzk.com:8081/repository/tzedu_npm_public/
# OR
yarn config set registry http://nexus.tanzk.com:8081/repository/tzedu_npm_public/
yarn global add @tzfe/create-tz-nuxt
```

创建一个项目：

```bash
t create project -d my-project
# OR
trn create project -d my-project
```

然后，利用助手，创建一个 code base

<img src='https://res.shiguangkey.com/homework/2020/4/22/153778a50e/15875198805981801.gif' alt="gen">

创建完毕，进入生成的项目，运行 `yarn dev`, 能看到如下效果，就算成功了：

<img src='https://res.shiguangkey.com/homework/2020/4/22/fe935f7f04/15875579176574290.gif' alt="demo">
