import Vue from "vue";
import PageLayout from "./PageLayout.vue";
// 插件开发之对象插件
//开发一个对象插件
const plugin = {
  // 在对象中必须包含一个install方法，这个方法会入参一个VueConstructor
  install(Vue) {
    //注册全局插件
    Vue.component("PageLayout", PageLayout);

    //注册全局过滤器
    //全局过滤器定义，第一个参数为过滤器名字，第二个参数为过滤器实现方法
    Vue.filter("dateFormat", function (val, type) {
      //   console.log(arguments);
      //做一个容错处理，通如果用户传递的是null、undefin、''
      if (!val) return "";
      let _d = new Date(val),
        yyyy = _d.getFullYear(),
        MM = _d.getMonth() + 1,
        DD = _d.getDate(),
        hh = _d.getHours(),
        mm = _d.getMinutes(),
        ss = _d.getSeconds();
      MM = MM > 9 ? MM : `0${MM}`;
      DD = DD > 9 ? DD : `0${DD}`;
      hh = hh > 9 ? hh : `0${hh}`;
      mm = mm > 9 ? mm : `0${mm}`;
      ss = ss > 9 ? ss : `0${ss}`;
      // 需要使用replace方法来进行数据格式化
      // return `${yyyy}年${MM}月${DD}日 ${hh}时${mm}分${ss}秒`
      // return `${MM}-${DD} ${hh}:${mm}:${ss}`
      // let res = 'yyyy年MM月DD日 hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
      // let res = 'yyyy-MM-DD hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
      // let res = 'yyyy-MM-DD hh:mm:ss'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
      return type.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function (key) {
        //   console.log(key);
        if (key === "yyyy") return yyyy;
        if (key === "MM") return MM;
        if (key === "DD") return DD;
        if (key === "hh") return hh;
        if (key === "mm") return mm;
        if (key === "ss") return ss;
      });
    });
  },
};

export default plugin;
