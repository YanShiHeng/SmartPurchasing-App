# vue-lesson vue教学使用

#### vue项目的解构
```
|—— vue-lesson
    |—— public                   // 静态页面文件包，不会对这个文件包进行编译
        |—— index.html           // 项目的入口页面
        |—— favicon.ico          // 项目的偏好图标
    |—— src                      // 项目的源代码包--以后的所有开发代码都应该在这个文件中进行处理
        |—— main.js              // 项目的主要逻辑入口、项目的功能入口
    |—— babel.config.js          // JS解析规则
    |—— pageckage.json           // 项目的运行命令、版本、描述、依赖(devDependencies --dev-save安装的依赖，dependencies --save安装的依赖)配置文件
```