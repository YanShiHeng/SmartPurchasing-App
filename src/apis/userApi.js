import ajax from './ajax'
// 手机验证码接口
function vdtCodeApi(phone) {
  return ajax({
    // url: 'http://www.shuiyue.info:14660/user/validate/code',
    url: '/user/validate/code',
    method: 'post',
    data: {
      phone
    }
  })
}
//用户自动登录接口
function autoLoginApi() {
  return ajax({
    url: '/user/auto/login',
    method: 'post',
  })
}
//用户登录验证接口
export function loginApi(data) {
  return ajax({
    url: '/user/app/login',
    method: 'post',
    data
  })
}
//获取单个用户信息接口
export function userInfoApi(id) {
  return ajax({
    url: '/user/info',
    params: {
      id
    }
  })
}
//获取用户权限信息接口
export function userRoleApi(ids) {
  return ajax({
    url: '/role/list/byids',
    params:{ids}
  })
}
//用户列表信息
export const userListApi = params => {
  return ajax({
      url: '/user/list',
      params
  })
}
export {
  autoLoginApi,
  vdtCodeApi
}
