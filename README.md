

#### vue项目的解构
```
|—— vue
    |—— public                   // 静态页面文件包，不会对这个文件包进行编译
        |—— index.html           // 项目的入口页面
        |—— favicon.ico          // 项目的偏好图标
    |—— src                      // 项目的源代码包--以后的所有开发代码都应该在这个文件中进行处理
        |—— index.js             // 项目的主要逻辑入口、项目的功能入口
        |—— views                // 缩写页面组件的模块
        |—— style                // 所有的全局样式编写、方法和变量等
        |—— store                // vuex状态管理器；编写状态管理modules、向外暴露一个store实例
        |—— router               // 路由管理模块；编写页面路由配置对象，路由钩子函数-beforEach
        |—— images               // 项目图片管理
        |—— apis                 // 数据交互，axios请求拦截
        |—— components           // 全局组件、插件
    |—— babel.config.js          // JS解析规则
    |—— pageckage.json           // 项目的运行命令、版本、描述、依赖(devDependencies --dev-save安装的依赖，dependencies --save安装的依赖)配置文件
    |——vue.config.js             // 用于脚手架的webpack配置：pages、lintOnSave、devServer
```