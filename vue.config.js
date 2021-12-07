// 这个检查机制太严格，需要去配置把这个ESLint去掉
// 因为是使用的vue-cli脚手架，所以需要对这个脚手架进行配置：需要新起一个配置文件 -> vue.config.js
// 因为当前项目是由webpack来进行运行，webpack是基于NodeJS的，因此配置文件由webpack读取和执行，所以vue.config.js应该是一个CommonJS规范的文件
// 是一个配置文件，因此需要把配置好的配置导出给webpack使用
// 因为这个配置是webpack来进行加载的，也就是这个文件需要使用NodeJS来执行，因此这个文件修改以后需要重新启动服务

module.exports = {
  // 打包专用路径
  publicPath:'./',
  // 关闭lint检查
  lintOnSave: false,
  // 配置项目页面
  pages: {
    // 需要指定名字
    index: {
      // 指定index页面应用的js实例
      entry: './src/index.js',
      // 指定index页面应用的模板
      template: './public/index.html'
    }
  },
  // 配置服务器选项   实际上是给webpack-dev-server(webpack的开发服务器)进行配置
  devServer: {
    // 端口
    port: 9000,
    // 使用默认浏览器打开应用
    open: true,
    // 解决axios跨域问题
    // 配置代理 -- 实际上在执行请求的时候，接口访问本地服务器，然后服务器去执行接口访问，然后把访问回来的接口返给前端
    proxy: {
      // 设置代理的关键字--在请求的地址中有这样的字符，如果有字符则执行代理
      // http://localhost:9000/apis/user/validate/code?phone=13611660001
      // 因为地址中包含了/apis字段，所以会被代理
      // 把 http://localhost:9000 => 服务器接收到请求后，使用http模块发送到http://www.shuiyue.info:16800
      // /apis/user/validate/code 地址，在发送请求的时候，使用pathRewrite 规则对地址进行重写：/user/validate/code
      // 所以本地的服务器会发送一个请求到远程服务器上去：http://www.shuiyue.info:16800/user/validate/code
      '/apis': {
        // 设置代理的目标
        target: 'http://www.shuiyue.info:16800',
        // 需要对地址中的多余字段"/apis"去掉
        pathRewrite: {
          '/apis': ''
        }
      }
    }
  }
}

// webpack 用过没有？
// webpack自己做技术研究时候用过，在项目中多用脚手架，vue使用vue.config.js对webpack进行配置
// 那你都配置过什么？
