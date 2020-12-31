## 移动端登录接入流程

> 一分钟让你的项目拥有登录能力。包括验证码登录、账号密码登录、微信和 QQ 快捷登录、绑定手机号码、找回密码功能。登录模块集成到项目里面，无需跳转到外部应用去登录。支持主题色等个性化配置。作者：冬然

## 安装 cli 工具

```javascript
npm install -g @tzfe/trn
or
yarn global add @tzfe/trn
```

## 集成登录

在项目根目录执行命令： `trn block`

选择“uniapp 项目登录块”时，如下图：

![block uni-view](https://frontend-static-cdn.shiguangkey.com/tz-doc/trn/blocks-login/uni-view.png "block uni-view")

**在 vue.config.js 中配置 `transpileDependencies`,如下所示：**

```
module.exports = {
  transpileDependencies: ['@tzfe/tz-mobile-ui'],
};
```

**现在你的项目便拥有登录能力啦~~~**

选择“nuxt/vue 项目登录块”时，如下图：

![block uni-view](https://frontend-static-cdn.shiguangkey.com/tz-doc/trn/blocks-login/uni-view.png "block uni-view")

## 项目目录结构变化

1、执行完命令后，项目的 pages 文件夹中新增 login 文件夹。如下：

```
├── pages
	├─login
    │ └─login.vue           // 登录页面
    │ └─bindPhone.vue       // 绑定手机号码页面
    │ └─forgetPassword.vue  // 忘记密码页面
    │ └─resetPassword.vue   // 设置密码页面
	....
```

2、选择 uniapp 项目安装时，会在 pages.json 文件中新增 4 个路由。如下:

```
// pages.json
{
    "pages":[
        ...
        {
            "path": "pages/login/index",
            "style": {
            "titleNView": false,
            "navigationBarTitleText": "登录"
            }
        },
        {
            "path": "pages/login/forgetPassword",
            "style": {
            "titleNView": false,
            "navigationBarTitleText": "忘记密码"
            }
        },
        {
            "path": "pages/login/resetPassword",
            "style": {
            "titleNView": false,
            "navigationBarTitleText": "设置密码"
            }
        },
        {
            "path": "pages/login/bindPhone",
            "style": {
            "titleNView": false,
            "navigationBarTitleText": "绑定手机号码"
        }
    ],
    ...
}
```

3、nuxt 项目执行完命令后，可跳转到 "/login/login" 路由，查看登录页面

4、vue 项目需自行配置路由，路由结构如下，可将以下代码拷贝至项目的路由文件中：

```
  const Login = () => import('@/pages/login'); // 登录页面
  const ForgetPassword = () => import('@/pages/login/forgetPassword'); // 忘记密码页面
  const ResetPassword = () => import('@/pages/login/resetPassword'); // 设置密码页面
  const BindPhone = () => import('@/pages/login/bindPhone'); // 绑定手机号码页面

  routes: [
    { path: '/login/login', name: 'login', component: Login },
    { path: '/login/forgetPassword', name: 'forgetPassword', component: ForgetPassword },
    { path: '/login/resetPassword', name: 'resetPassword', component: ResetPassword },
    { path: '/login/bindPhone', name: 'bindPhone', component: BindPhone },
  ],

```

## 个性化配置

登录模块支持主题色、标题、slogan 的配置。默认的配置如下：

- 主题色：rgb(48, 115, 244)。
- 标题：潭州课堂
- slogan：为每个人找到好老师

![block setting-default](https://frontend-static-cdn.shiguangkey.com/tz-doc/trn/blocks-login/setting-default.png "block setting-default")

### 设置主题色

```
// login/login.vue
<template>
  <tz-login :color="color" />
</template>

export default {
  data() {
    return {
      color: 'rgb(65 44 241)', // 紫色
    };
  },
};

```

![block setting-color](https://frontend-static-cdn.shiguangkey.com/tz-doc/trn/blocks-login/setting-color.png "block setting-color")

### 设置标题和标语

```
// login/login.vue
<template>
  <tz-login :title="title" :slogan="slogan" />
</template>
export default {
  data() {
    return {
      title: '潭州互动课',
      slogan: '颠覆你对普通话的认知',
    };
  },
};

```

![block setting-title](https://frontend-static-cdn.shiguangkey.com/tz-doc/trn/blocks-login/setting-title.png "block setting-title")

## 其他配置

### 配置环境变量

环境变量的值为：test/fat/pre/prod 其中之一。选 uniapp 项目安装时默认 env：process.env.VUE_APP_EXEC_ENV，选择 nuxt/vue 项目安装时默认 env: process.env.TZ_ENV，如果默认值不是你项目中的变量名，请将以上变量进行修改。如下：

```
// login/login.vue
<template>
  <tz-login :apiFixParams="apiFixParams"/>
</template>

export default {
  data() {
    return {
      // 调用api接口时需要传的固定参数
      apiFixParams: {
        env: process.env.XXXXX,
      },
    };
  },
};
</script>
```

### 跳转到登录页面

uniapp 项目

```
uni.navigateTo({
  url: '/pages/login/login?redirect=pages/postDetail/postDetail?id=9574'
});

// 如果项目中多个页面都会触发登录，且登录成功后跳转到触发登录页面，可以使用一下方式跳转
const pages = getCurrentPages();
const { route, options } = pages[pages.length - 1];
const params = Object.entries(options).reduce((pre, [key, value]) => {
    return `${pre}${pre ? '&' : '?'}${key}=${value}`;
  }, '');
uni.navigateTo({
  url: `/pages/login/login?redirect=${`${route}${params}`}`
});
```

nuxt/vue 项目

```
this.$router.push({
  path: '/login/login',
  query: {
    redirect: this.$route.fullPath, // redirect的格式：'/detail?id=23'
  },
});
```

## 获取 token/用户信息

### 方式 1

- 脚手架创建的 uni-app 项目推荐使用方式 1
- 项目在 store/module/auth.js 中的 state 中有 token 和 userInfo。如下所示：

```
// store/types.js
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USERINFO = 'SET_USERINFO';

// store/module/auth.js
import { SET_TOKEN, SET_USERINFO } from '../types';
export default {
  state: {
    token: '',
    userInfo: null,
  },
  mutations: {
    [SET_TOKEN](state, token) {
      state.token = token;
    },
    [SET_USERINFO](state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {},
  getters: {},
};
```

- 登录成功后，组件会将 token 和 userInfo(用户信息)存入 vuex 中。
- 如果 token 成功存入 vuex 中，登录成功后跳转的页面地址不会拼接 token 参数，如果存入失败，则会拼接
- 如果你对 store/module/auth.js 中 state 里面的 token 和 userInfo 以及 mutations 中的 SET_TOKEN, SET_USERINFO 做了修改，登录组件可能无法将值存入 vuex 中。你可以通过一下方式二拿到 token 和 userInfo

### 方式 2

- 分别在 login/index.vue 和 login/bindPhone.vue 中添加 loginSuccess 监听事件，如下所示：

```
// login/index.vue
<template>
  <tz-login @loginSuccess="loginSuccess"/>
</template>
<script>
export default {
  methods: {
    loginSuccess({ token, userInfo }) {
      console.log(token, userInfo);
    },
  },
};
</script>

// login/bindPhone.vue
<template>
  <tz-bind-phone @loginSuccess="loginSuccess"/>
</template>
<script>
export default {
  methods: {
    loginSuccess({ token, userInfo }) {
      console.log(token, userInfo);
    },
  },
};
</script>
```

## 退出登录

- 可以引用 TzLogout 组件实现。示例如下：

```
<template>
  <tz-logout :token="token" @logout="logout">退出登录按钮</tz-logout>
</template>
<script>
import TzLogout from '@tzfe/tz-mobile-ui/packages/logout/src/logout.vue';
export default {
  components: {
    TzLogout,
  },
  computed: {
    token() {
      return this.$store.state.auth.token;
    },
  },
  methods: {
    //  可以监听 logout 事件，在退出登录后会执行 logout 方法。
    logout() {
      this.$toast('已退出登录!');
    },
  },
};

```

- 如果获取 token/用户信息是使用的方式 1，那么组件会清空 vuex 中 token 和 userInfo。否则接入方需监听 logout 事件，自行清空 vuex 中 token 和 userInfo
- token 是非毕传的。如果没有，组件会获取 this.\$store.state.auth.token 的值
