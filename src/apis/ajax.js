import axios from 'axios'
import store from '../store'
// 可以使用axios的拦截功能，总共有两个拦截：请求前、请求后
// axios的拦截器使用，可以使用请求前拦截，需要给请求体添加一个中间件，业务如果通过中间件处理，会继续执行请求业务
// use方法的回调函数，会入参一个AxiosRequestConfig对象
// 回调函数要求必须返回一个AxiosRequestConfig对象或一个Promise.reject方法
// 如果在拦截器中返回一个reject方法，会在axios.request方法的catch中捕获到
axios.interceptors.request.use(config => {
  // 获取状态管理器vuex中保存的自动登录token票据
  let token = store.getters['common/token']
  const otherPath = ['/user/validate/code'] // 这里保存的是请求时不需要带x-token参数的地址
  if (otherPath.includes(config.url)) {
    return config
  } else {
    // 将token加到请求体中
    config.headers.token = token
    return config
  }
})
// function ajax(req = {}) {
// const ajax = (req = {}) => {
// export default function(req = {}) {
export default (req = {}) => {
  if (!req.url) throw new Error('请求接口，url必传')
  return new Promise(resolve => {
    axios.request({
      // 请求地址
      url: req.url,
      // 请求类型
      method: req.method || 'GET',
      // get请求  地址传参用params
      params: req.params || {},
      //   post请求  请求体传参用data
      data: req.data || {},
      // 超时设置：5s  设置了在5秒内请求数据  如果没有请求成功就执行错误函数
      timeout: req.timeout || 5000,
      // 可以给请求地址添加通用的路径字符，在执行请求的时候，baseURL会和url进行拼接
      // baseURL: 'http://www.shuiyue.info:14660'
      //服务器代理，解决跨域问题
      baseURL: '/apis'
    }).then(({
      data
    }) => {
      // axios返回的是一个response响应体对象，而后端的数据在其中的data对象上，所以使用解构赋值语法来得到后端的数据data
      resolve(data)
    }).catch(err => {
      console.log(err)
      resolve({
        code: 500,
        message: '后端接口问题，请联系后端进行处理'
      })
    })
  })
}

// 这个是AxiosRequestConfig可以进行配置的属性定义
// export interface AxiosRequestConfig<D = any> {
//     url?: string;
//     method?: Method;
//     baseURL?: string;
//     transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
//     transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
//     headers?: AxiosRequestHeaders;
//     params?: any;
//     paramsSerializer?: (params: any) => string;
//     data?: D;
//     timeout?: number;
//     timeoutErrorMessage?: string;
//     withCredentials?: boolean;
//     adapter?: AxiosAdapter;
//     auth?: AxiosBasicCredentials;
//     responseType?: ResponseType;
//     xsrfCookieName?: string;
//     xsrfHeaderName?: string;
//     onUploadProgress?: (progressEvent: any) => void;
//     onDownloadProgress?: (progressEvent: any) => void;
//     maxContentLength?: number;
//     validateStatus?: ((status: number) => boolean) | null;
//     maxBodyLength?: number;
//     maxRedirects?: number;
//     socketPath?: string | null;
//     httpAgent?: any;
//     httpsAgent?: any;
//     proxy?: AxiosProxyConfig | false;
//     cancelToken?: CancelToken;
//     decompress?: boolean;
//     transitional?: TransitionalOptions;
//     signal?: AbortSignal;
//     insecureHTTPParser?: boolean;
// }

// export default ajax
