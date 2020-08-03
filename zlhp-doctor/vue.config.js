const path = require("path");

/**
 * 目录转换
 * @param dir
 * @returns {string}
 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",

  css: {
    extract: false,
    sourceMap: false
  },

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // 是否生成生产环境中的 *.map 文件
  productionSourceMap: false,

  devServer: {
    // 新版的webpack-dev-server增加了安全验证，默认检查hostname，如果hostname不是配置内的，将中断访问。
    // 所以添加此配置
    disableHostCheck: true,

    host: "127.0.0.1",
    port: 80,
    https: false,
    hotOnly: true, // 热更新

    proxy: {
      // 普通接口
      "/v1": {
        target: `${process.env.DOMAIN}:20716`,
        ws: false,
        changeOrigin: true
      },
      // 对外接口
      "/api": {
        target: `${process.env.DOMAIN}:20716`,
        ws: false,
        changeOrigin: true
      },
      // 微信接收消息
      "/wx": {
        target: `${process.env.DOMAIN}:20716`,
        ws: false,
        changeOrigin: true
      },
      // 上传接口
      "/upload": {
        target: `${process.env.DOMAIN}:20718`,
        ws: false,
        changeOrigin: true
      },
      // 文件资源接口
      "/res": {
        target: `${process.env.DOMAIN}:20718`,
        ws: false,
        changeOrigin: true
      }
    }
  },

  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);

    config.resolve.alias.set("@", resolve("src"));
  }
};
