<template>
  <page-layout text="项目管理" :showNew="true">
    <ul class="my-project-list" @scroll="scrollEvent">
      <li v-for="item in list" :key="item.id">
        <div class="left">
          <span class="title">{{ item.name }}</span>
          <span class="text">负责人：{{ item.ownerName }}</span>
          <span class="text"
            >签订日期：{{
              item.signTime | dateFormat("yyyy-MM-DD hh:mm:ss")
            }}</span
          >
          <span class="text">地址：{{ item.address }}</span>
        </div>
        <div class="right">
          <i></i>
          <i class="del"></i>
        </div>
      </li>
      <li class="loading-text">
        <span v-if="isLoading">加载中...</span>
        <span v-if="hasMore && !isLoading">上滑加载更多数据</span>
        <span v-if="!hasMore && !isLoading">没有更多数据</span>
      </li>
    </ul>
  </page-layout>
</template>
<script>
import { projectListApi } from "../../apis/projectApi";
export default {
  data() {
    return {
      query: {
        page: 1,
        size: 6,
      },
      list: [],
      isLoading: true,
      hasMore: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取项目列表信息
    async getList() {
      let result = await projectListApi(this.query);
      console.log("项目列表信息", result);
      if (result.code === 200) {
        //因为每次后端都是返回当前页面的数据，不会把之前的数据进行返回，因此需要自己拼接
        this.list = [...this.list, ...result.data.rows];
        console.log(this.list);
        // 是否有更多数据：已经获得的数据量和后端中数据的总数对比，如果已经获得的数据量大于或等于后端中数据的总数则没有更多数据，反之则有
        //已经获得的数据量小于后端中数据的总数时为true
        this.hasMore = this.query.page * this.query.size < result.data.total;
      }
      //因为赋值是异步的，因此每次加载完成数据以后，要执行一个setTimeout来阻断页面刷新
      //   setTimeout(() => {
      this.isLoading = false;
      //   });
    },
    //滚动加载内容
    scrollEvent(eve) {
      //如果没有更多数据了，不需要执行滚动业务
      if (!this.hasMore) return;
      //数据正在加载中，不能执行滚动加载的所有业务
      if (this.isLoading) return;
      //监听页面的滚动高度
      //   如果 滚动距离（eve.target.scrollTop）加上当前窗口高度（eve.target.clientHeight）等于窗口内容的真实高度（eve.target.scrollHeight）则表示页面已经滚动到底部了，可以执行下页数据的加载
      // evt.target.scrollHeight获取的是整个内容区的高度，包括由于出现滚动条而隐藏的内容的高度
      let distance =
        eve.target.scrollHeight -
        (eve.target.scrollTop + eve.target.clientHeight);
      //当用户滚到距离顶部大概16像素的时候就开始加载
      if (distance < 16) {
        this.isLoading = true;
        //因为要获取下一页的数据，因此需要对query.page进行加一
        this.query.page += 1;
        //调用获取数据的接口来获取数据
        this.getList();
      }
    },
  },
  // filters: {
  //   //定义一个过滤器，方法必须返回展示内容
  //   //过滤器在使用的时候，第一个参数始终为使用过滤器的数据值，从第二个起为传递的参数
  //   dateFormat: function (val, type) {
  //     //   console.log(arguments);
  //     //做一个容错处理，通如果用户传递的是null、undefin、''
  //     if (!val) return "";
  //     let _d = new Date(val),
  //       yyyy = _d.getFullYear(),
  //       MM = _d.getMonth() + 1,
  //       DD = _d.getDate(),
  //       hh = _d.getHours(),
  //       mm = _d.getMinutes(),
  //       ss = _d.getSeconds();
  //     MM = MM > 9 ? MM : `0${MM}`;
  //     DD = DD > 9 ? DD : `0${DD}`;
  //     hh = hh > 9 ? hh : `0${hh}`;
  //     mm = mm > 9 ? mm : `0${mm}`;
  //     ss = ss > 9 ? ss : `0${ss}`;
  //     // 需要使用replace方法来进行数据格式化
  //     // return `${yyyy}年${MM}月${DD}日 ${hh}时${mm}分${ss}秒`
  //     // return `${MM}-${DD} ${hh}:${mm}:${ss}`
  //     // let res = 'yyyy年MM月DD日 hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
  //     // let res = 'yyyy-MM-DD hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
  //     // let res = 'yyyy-MM-DD hh:mm:ss'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
  //     return type.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function (key) {
  //       //   console.log(key);
  //       if (key === "yyyy") return yyyy;
  //       if (key === "MM") return MM;
  //       if (key === "DD") return DD;
  //       if (key === "hh") return hh;
  //       if (key === "mm") return mm;
  //       if (key === "ss") return ss;
  //     });
  //   },
  // },
};
</script>
