import Ajax from './ajax'
//回款统计接口
export const collectionApi = () => Ajax({
  url: '/analysis/collection'
});
// 付款统计接口
export const payableApi = () => Ajax({
  url: '/analysis/payable'
})
