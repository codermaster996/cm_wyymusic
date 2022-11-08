// vue 项目的配置文件  覆盖

module.exports = {
  lintOnSave: false, // 暂时关闭代码格式检测

  // 配置反向代理
  devServer: {
    port: 81,
    proxy: {
      //
      '/dashi': {
        target: 'http://39.107.72.219:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/dashi': ''
        }
      }
    }
  }
}
