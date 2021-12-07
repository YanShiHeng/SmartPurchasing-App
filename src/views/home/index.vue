<template>
  <div>
    <page-layout text="凌动智能采购系统">
      <div>
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <div ref="lineNode" class="chart-box"></div>
          </van-swipe-item>
          <van-swipe-item>
            <div ref="pieNode" class="chart-box"></div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <ul class="func-box">
        <li v-for="it in list" :key="it.title">
          <span class="title">{{ it.title }}</span>
          <div class="item" v-for="item in it.children" :key="item.name">
            <i @click="toPage(item)" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </page-layout>
  </div>
</template>
<script>
import LineChart from "./LineChart.vue"; //折线图
import PieChart from "./PieChart"; //饼图
import { collectionApi, payableApi } from "../../apis/homeApi"; //接口
//echarts使用
// 第一步：引入echarts库
import echarts from "echarts";
export default {
  mixins: [LineChart, PieChart],
  data() {
    return {
      list: [
        {
          title: "基础数据",
          children: [
            {
              id: "SYSTEM-01-05",
              right: "R",
              icon: "product-list",
              name: "材料管理",
              path: "",
            },
            {
              id: "SYSTEM-01-05",
              right: "C",
              icon: "product-new",
              name: "新建材料",
              path: "",
            },
            {
              id: "SYSTEM-01-06",
              right: "R",
              icon: "supplier-list",
              name: "供应商管理",
              path: "",
            },
            {
              id: "SYSTEM-01-06",
              right: "C",
              icon: "supplier-new",
              name: "新建供应商",
              path: "",
            },
          ],
        },
        {
          title: "项目管理",
          children: [
            {
              id: "PROJECT-01-01",
              right: "R",
              icon: "project-list",
              name: "项目管理",
              path: "/project",
            },
            {
              id: "PROJECT-01-01",
              right: "C",
              icon: "project-new",
              name: "新建项目",
              path: "",
            },
          ],
        },
        {
          title: "采购管理",
          children: [
            {
              id: "PURCHASE-01-01",
              right: "R",
              icon: "purchase-list",
              name: "采购管理",
              path: "/purchase",
            },
            {
              id: "PURCHASE-01-01",
              right: "C",
              icon: "purchase-new",
              name: "新建采购",
              path: "/purchase/edit",
            },
          ],
        },
        {
          title: "收货管理",
          children: [
            {
              id: "RECEIVING-01-01",
              right: "R",
              icon: "receive-list",
              name: "收货管理",
              path: "",
            },
            {
              id: "RECEIVING-01-01",
              right: "C",
              icon: "receive-new",
              name: "新建收货",
              path: "",
            },
          ],
        },
        {
          title: "系统管理",
          children: [{ icon: "setting", name: "设置", path: "" }],
        },
      ],
    };
  },
  // 需要使用computed属性来获取用户权限信息
  computed: {
    rights() {
      return this.$store.getters["common/userRights"];
    },
  },

  // 第二步：对echarts进行初始化，需要传递一个dom节点
  // 在mounted生命周期中进行，因为要获取节点
  async mounted() {
    // 折线图
    // 调用init方法
    this.lineChart = echarts.init(this.$refs.lineNode);
    //使用回款统计接口获取数据
    let result = await collectionApi();
    console.log(result);
    //调用渲染方法
    this.renderLineChart(result.data);
    // 饼图
    //调用init方法来初始化
    this.pieChart = echarts.init(this.$refs.pieNode);
    // 使用付款统计接口获取数据
    let payable = await payableApi();
    console.log(payable);
    //调用渲染方法
    this.renderPieChart(payable.data);
  },
  methods: {
    //根据用户的点击，来判断是否有权限访问页面
    toPage(item) {
      //如果用户点击的这个菜单没有right这个属性，表示该菜单不需要权限，用户可以直接进入
      if (!item.right) {
        this.$toast.success("不需要权限");
        return;
      }

      // console.log(this.rights);
      // 在权限数组中找到对应的菜单权限
      let myRights = this.rights.find((it) => it.id === item.id);
      //如果myRights为false，表示被点击元素连对应的权限菜单都没有
      if (!myRights) {
        this.$toast.fail("你没有访问这个页面的权限");
        return;
      }
      // 如果菜单权限存在，需要判断具体的使用权限
      //如果有对应的权限菜单并且其中还有访问下个页面的权限
      if (myRights.role.includes(item.right)) {
        if (!item.path) {
          this.$toast("此功能正在建设中...");
        } else {
          this.$router.push(item.path);
        }
      } else {
        //有对应的权限菜单但是没有访问下个页面的权限
        this.$toast.fail("你没有访问这个页面的权限");
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../style/common.less";
.chart-box {
  display: block;
  height: 270px;
}
.func-box {
        > li {
            display: block;
            position: relative;
            margin: 0 20px 20px;
            background: #fff;
            .clear();
            > .title {
                display: block;
                padding: 8px 12px;
                color: #e07439;
                font-size: .8rem;
                line-height: 22px;
                border-bottom: solid 1px #ddd;
                &::before {
                    content: '';
                    display: inline-block;
                    vertical-align: bottom;
                    height: 22px;
                    width: 2px;
                    background: @primary;
                    margin-right: 8px;
                }
            }

            > .item {
                float: left;
                width: 25%;
                margin: 10px 0;
                i {
                    display: block;
                    width: 48px;
                    height: 48px;
                    margin: auto;
                    background-position: center;
                    background-size: 30px;
                    background-repeat: no-repeat;
                    // background: url(../../images/home/setting.png) center center / 30px 30px no-repeat;
                    // &.product-list {
                    //     background-image: url("../../images/home/product-list.png");
                    // }
                    .loop();
                }
                span {
                    display: block;
                    font-size: .6rem;
                    color:#e07439;
                    text-align: center;
                }
            }
        }
    }
   // less的for遍历来实现多个图片样式的编写
  // 定义一个less数组
  @list: product-list product-new project-list project-new purchase-list purchase-new receive-list receive-new setting supplier-list supplier-new;
  //实现for遍历，在less中需要使用到递归来实现，在less中小标是从1开始
  // less 中获取数组的长度：length函数
  .loop(@index:1) when(@index<=length(@list)){
    @name:extract(@list,@index);
    //类名参数需要加大括号  @{name}
    &.@{name}{
      background-image: url("../../images/home/@{name}.png");;
    }
    //需要递归遍历
    .loop(@index+1);
}
</style>
