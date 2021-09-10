# 在项目中体验 yarn 2 代

1. 项目中设置为 yarn2

```
yarn set version berry
```

此时会请求上文提到的网络文件，等待一会儿。

2. yarn 会创建 .yarn 目录和 .yarnrc.yml 文件，用户需要关注的只是 .yarnrc.yml 文件，它等同于 1 代的 .yarnrc 文件。

此时再执行
`yarn --version`
得到 2.4.1 或者更高。

配置.yarnrc.yml

它默认只有一句：yarnPath: ".yarn/releases/yarn-berry.cjs"

设置淘宝源：npmRegistryServer: "https://registry.npm.taobao.org"

官方手册：https://www.yarnpkg.cn/configuration/yarnrc
