import Vue from 'vue'

import App from './views'
// 引入路由
import router from './router'
// 引入状态管理器
import store from './store'
// 全局安装vant组件
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant);
//全局通用样式
//放在后面是因为样式加载有一个覆盖的效果，后加载会覆盖先加载
import './style/index.less'

// vue插件开发---两种模式：方法、对象
// 方法插件，它会进行传递一个VueContructor对象作为入参
// import PageLayout from './views/common/PageLayout.vue'
// const plugin = function (_Vue) {
//   _Vue.component('PageLayout',PageLayout)
// }
// Vue.use(plugin);

// 对象插件
import plugin from './components'
Vue.use(plugin);
new Vue({
  // 路由全局注册
  router,
  // 状态管理器全局注册
  store,
  render: ce => ce(App)
}).$mount('#app')
