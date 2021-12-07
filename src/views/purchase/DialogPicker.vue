<template>
  <van-popup v-model="show" position="right" @click-overlay="closeEvt" :style="{ height: '100%', width: '80%' }">
    <ul v-if="list.length > 0" class="picker-list">
      <li @click="pickEvt($event, item)" v-for="item in ulLis" :key="item.id">
        {{ item.name }}
      </li>
      <!-- 分页组件 -->
      <van-pagination v-if="list.length > 15" v-model="currentPage" :total-items="list.length" :items-per-page="15" />

      <!-- 多选的确定按钮 -->
      <van-button @click="sureEvt" round block v-if="isDX" color="#ff5513">确定</van-button>
    </ul>
    <span v-else>数据请求中</span>
  </van-popup>
</template>
<script>
import { materialListApi, supplierListApi } from "../../apis/purchaseApi";
import { projectListApi } from "../../apis/projectApi";
import { userListApi } from "../../apis/userApi";
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isDX: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      ulLis: [],
      list: [],
      selectedData: [], //储存多选时选中的审批人信息
      currentPage: 1,
      userListParams: {
        page: 1,
        size: 15,
      },
    };
  },
  //当用户点击选择某某某之后弹出框出现的时候（即show为true时）才会根据type的不同，去调用不同的接口请求数据
  watch: {
    // 监听shw的变化 第一个参数为变化之后的值（也就是现在的值），第二个参数为变化之前的值
    async show(newValue) {
      if (newValue) {
        if (this.type === "project") {
          //项目列表接口
          let result = await projectListApi({ page: 1, size: 200 });
          this.list = result.data.rows;
        } else if (this.type === "material") {
          //材料列表接口
          let result = await materialListApi();
          console.log(result);
          this.list = result.data.rows;
        } else if (this.type === "supplier") {
          // 供应商列表接口
          let result = await supplierListApi({ page: 1, size: 500 });
          this.list = result.data.rows;
        } else if (this.type === "user") {
          let result = await userListApi({ page: 1, size: 500 });
          this.list = result.data.rows;
        }
        //ulLis中的数据为页面显示的数据，用于实现分页
        this.ulLis = this.list.slice(
          (this.currentPage - 1) * 15,
          15 * this.currentPage
        );
        //每次进弹出框的时候重置selectedData
        this.selectedData = [];
      } else {
        this.list = [];
      }
    },
    async currentPage(val) {
      console.log(val);
      this.ulLis = this.list.slice((val - 1) * 15, 15 * val);
    },
  },
  methods: {
    // 点击遮罩层时触发
    closeEvt() {
      this.$emit("update:show", false);
      // console.log(111);
    },
    //多选时确认按钮事件
    sureEvt() {
      this.$emit("pickEvt", this.selectedData, this.type);
    },
    // 选项点击事件
    pickEvt(evt, item) {
      //  evt.target.classList.contains("className1")
      //   evt.target.style.background = "#ff5513";
      //   evt.target.style.color = "#fff";
      // console.log(evt.target);
      // 如果是多选，则给selectedData添加数据，否则直接把数据返回到父组件中
      if (this.isDX) {
        //判断被点击的选项是否包含liBg这个类名来表示该选项是否已被选择，如果已被选择之后再点击则为取消选择
        if (evt.target.classList.contains("liBg")) {
          //已有此类名
          evt.target.classList.remove("liBg");
          //删除this.selectedData中对应的数据，即取消选中时并删除此审批人数据
          this.selectedData.map((it, k) => {
            if (it.id === item.id) this.selectedData.splice(k, 1);
          });
        } else {
          evt.target.classList.add("liBg");
          this.selectedData.push(item);
        }
      } else {
        //不是多选则直接提交数据到父组件中
        this.$emit("pickEvt", item, this.type);
        this.$emit("update:show", false);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.picker-list {
  display: block;
  position: relative;
  padding: 8px 12px;
  .van-pagination__item {
    min-width: 30px !important;
    height: 30px !important;
  }
  > li {
    padding: 4px 10px;
    border-bottom: 1px solid #ddd;
    line-height: 26px;
    color: #ff5513;
    font-size: 0.7rem;
    &.liBg {
      background: #ff5513;
      color: #fff;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
.van-button {
  margin-top: 8px;
}
</style>
