import Vue from 'vue'
// 引入状态管理器插件
import Vuex from 'vuex'
// 引入独立的状态数据模块
import common from './common'
// 引入第三方库 vuex-persistedstat来让状态管理器中的数据持久化（使其储存在localstorage中），不然一刷新状态管理器中的数据就没有了
import presistedState from 'vuex-persistedstate'
// 注册状态管理器插件
Vue.use(Vuex)
// Store实例化
const store = new Vuex.Store({
  // 通过一个插件属性来将一个用于数据持久化的插件进行注册
  plugins: [presistedState({})],
  // 实例化参数
  modules: {
    common
  }
})

export default store
