export default {
  hash: true,
  title: "create-tz cli",
  logo:
    "https://frontend-static-cdn.shiguangkey.com/tz-common-logo/logo-middle.svg",
  mode: "site",
  publicPath: "./",
  history: { type: "hash" },
  resolve: {
    includes: ["./docs"],
    previewLangs: [],
  },
  locales: [["zh-CN", "中文"]],
  favicon:
    "https://frontend-static-cdn.shiguangkey.com/tz-common-logo/favicon.ico",
  menus: {},

  navs: [
    null,
    {
      title: "问题反馈",
      path: "http://wiki.tanzk.cn/pages/viewpage.action?pageId=60001534",
    },
  ],
  polyfill: false,
  extraBabelPlugins: [
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: "css",
      },
    ],
  ],
  exportStatic: {},
};
