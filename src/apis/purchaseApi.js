import Ajax from "./ajax";
//采购订单列表接口
export const purchaseListApi = (params) => {
  return Ajax({
    url: "/purchase/list",
    params,
  });
};
//删除采购订单接口
export const purchaseDeleteApi = (id) => {
  return Ajax({
    url: `/purchase/delete/${id}`,
    method: "post",
  });
};
//更新采购订单状态接口
export const purchaseFlowApi = (data) => {
  return Ajax({
    url: "/purchase/flow",
    method: "post",
    data,
  });
};
//采购订单信息接口
export const purchaseInfoApi = (id) => {
  return Ajax({
    url: "/purchase/info",
    params: {
      id,
    },
  });
};
//材料列表接口
export const materialListApi = () =>
  Ajax({
    url: "/material/list",
  });
//供应商列表接口
export const supplierListApi = (params) => {
  return Ajax({
    url: "/supplier/list",
    params,
  });
};
//更新采购订单信息接口
export const purchaseUpdateApi = (data) => {
  return Ajax({
    url: "/purchase/update",
    method: "post",
    data,
  });
};
//保存采购订单信息接口
export const purchaseSaveApi = (data) => {
  return Ajax({
    url: "/purchase/save",
    method: "post",
    data,
  });
};
