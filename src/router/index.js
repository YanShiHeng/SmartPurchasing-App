import Vue from 'vue' // 引入Vue
// 引入router插件
import Router from 'vue-router'
// 引入页面路由组件
import Login from '../views/login'
import Home from '../views/home'
import NotFound from '../views/common/NotFound'
import ProductEdit from '../views/product/edit'
import ProjectList from '../views/project'
import Purchase from '../views/purchase'
import PurchaseDetail from '../views/purchase/Detail'
import PurchaseEdit from '../views/purchase/Edit'
// 因为在vue实例对象中使用this.$store的时候，这个对象指向的是  src/store/index.js文件中的store实例
// 因为这个页面不是一个vue文件，所以没有this对象，因此在使用store实例的时候需要自行引入store实例
import store from '../store'
// 注入路由插件
Vue.use(Router)
// 设置路由参数  定义routers
const routes = [
  // 定义默认路由
  {
    path: '/',
    redirect: '/login'
  },
  // 定义登录路由
  {
    path: '/login',
    component: Login
  },
  // 定义首页路由
  {
    path: '/home',
    component: Home,
    meta: {
      // meta中的required参数用作决定本路由是否需要用户登录才能访问
      required: true
    }
  },
  // 定义产品编辑路由
  {
    path: '/product/edit',
    component: ProductEdit,
    meta: {
      // meta中的required参数用作决定本路由是否需要用户登录才能访问
      required: true
    }
  },
  //定义项目管理路由
  {
    path: '/project',
    component: ProjectList,
    meta: {
      required: true
    }
  },
  //定义采购订单管理路由
  {
    path: '/purchase',
    component: Purchase,
    meta: {
      required: true
    }
  },
  //定义采购订单详情路由
  {
    path: '/purchase/detail',
    component: PurchaseDetail,
    meta: {
      required: true
    }
  },
  //定义新建采购订单路由
  {
    path: '/purchase/edit',
    component: PurchaseEdit,
    meta: {
      required: true
    }
  },
  // 定义其它路由
  {
    path: '*',
    component: NotFound
  }
]
// 路由实例化
const router = new Router({
  routes
})
// 全局拦截
router.beforeEach((to, from, next) => {
  // 如果去的页面路由不需要用户登录就能访问
  // meta中的required参数用作决定本路由是否需要用户登录才能访问
  if (!to.meta.required) {
    next()
    return false
  }

  // 登录校验  获取状态管理器中的token值
  const token = store.getters['common/token']
  // debugger
  // console.log(store.getters)
  if (token) {
    next()
  } else {
    // 判断当前页面是否是登录页面，如果不是则跳转到登录页面，是则不跳转
    if (from.path !== '/login') next('/login')
    // console.log(from.path)
  }
})

// 导出路由
export default router
