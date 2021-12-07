<template>
  <page-layout :showNew="true" text="管理采购单" @btnEvt="toNewPage">
    <header class="my-header">
      <input type="text" v-model="query.projectName" placeholder="输入项目名进行查询" />
      <van-dropdown-menu>
        <van-dropdown-item v-model="query.state" :options="option1" />
      </van-dropdown-menu>
      <i @click="searchEvt(query)"></i>
    </header>
    <ul class="my-project-list purchase" @scroll="scrollEvent">
      <li v-for="item in list" :key="item.id">
        <van-swipe-cell>
          <!-- #left指定插槽的名字 -->
          <template #left>
            <van-button square type="primary" text="详情" @click="btnEvt(item, 'detail')" />
          </template>
          <div class="my-left">
            <span class="title">
              {{ item.projectName }}
              <em>{{ item.state }}</em>
            </span>
            <span class="text">创建人：{{ item.createName }}</span>
            <span class="text">创建日期：{{ item.createTime | dateFormat("yyyy-MM-DD") }}</span>
            <span class="text">
              材料：{{
                `${item.materialName} -- ${item.materialWeight}${item.materialUnit}`
              }}
            </span>
          </div>
          <!-- 每一行的按钮：受权限控制和用户账号、数据的state有关 -->
          <!-- 详情按钮，应该在整个单据中都应该显示，而且能够进入页面的用户都可以查看 -->
          <!-- 当数据的状态为：新建，显示编辑、删除、确认；删除不会执行物理，它只会执行逻辑删除--就是把单据的状态改为作废，因为要追踪每一条数据的所有信息 -->
          <!-- 当数据的状态为：确认，显示在途 -->
          <!-- 当数据的状态为：在途，显示完成 -- 通过在途和完成的审批时间可以知道货物在运输的途中花费了多少时间，完成以后可以通知对应验货人员进行货物验收 -->
          <!-- 当数据的状态为：完成，显示付款 -->
          <!-- 每行按钮显示 -->
          <template #right>
            <van-button @click="btnEvt(item, 'delete')" v-if="item.state === '新建'" square type="danger" color="#ee0a25" text="删除" />
            <van-button @click="btnEvt(item, 'edit')" v-if="item.state === '新建'" square type="primary" color="#ff976a" text="编辑" />
            <van-button @click="btnEvt(item, 'confirm')" v-if="item.state === '新建'" square color="#ff5b02" text="确认" />
            <van-button @click="btnEvt(item, 'inline')" v-if="item.state === '确认'" square color="#7232dd" text="在途" />
            <van-button @click="btnEvt(item, 'finish')" v-if="item.state === '在途'" square color="#ff5b02" text="完成" />
            <van-button @click="btnEvt(item, 'payment')" v-if="item.state === '完成'" square color="#7232de" text="付款" />
          </template>
        </van-swipe-cell>
      </li>
      <li class="loading-text loadingColor">
        <span v-if="isLoading">加载中...</span>
        <span v-if="hasMore && !isLoading">上滑加载更多数据</span>
        <span v-if="!hasMore && !isLoading">没有更多数据</span>
      </li>
    </ul>
    <!-- 采购流程步骤 -->
    <!-- vant弹出层+步骤条+单选框 -->
    <van-popup v-model="show" round :close-on-click-overlay="false" position="bottom" :style="{ height: '35%' }">
      <!-- 步骤条 -->
      <van-steps :active="active" active-icon="success" active-color="#38f">
        <van-step>新建</van-step>
        <van-step>确认</van-step>
        <van-step>在途</van-step>
        <van-step>完成</van-step>
      </van-steps>
      <!-- 审批人 -->
      <span class="fontSize">审批人：</span><input type="text" :value="flowData.userName" readonly class="approveInp" />
      <br />
      <!-- 是否通过 单选框-->
      <span class="fontSize">是否通过：</span>
      <van-radio-group v-model="flowData.isReject" direction="horizontal">
        <van-radio :name="false">通过</van-radio>
        <van-radio :name="true">驳回</van-radio>
      </van-radio-group>
      <br />
      <!-- 备注 -->
      <span class="fontSize remarks">备注：</span>
      <textarea v-model="flowData.remark" style="width: 100%; height: 38px" class="fontSize"></textarea>
      <!-- 确认和取消操作 -->
      <div class="fontSize but" style="magin-top: 10px">
        <van-button size="small" type="primary" @click="confirmEvt">确定</van-button>
        <van-button size="small" type="default" @click="show = false">取消</van-button>
      </div>
    </van-popup>
  </page-layout>
</template>
<script>
import {
  purchaseDeleteApi,
  purchaseFlowApi,
  purchaseListApi,
} from "../../apis/purchaseApi";
export default {
  data() {
    return {
      query: {
        projectName: "",
        state: "",
        page: 1,
        size: 5,
      },
      option1: [
        { text: "全部", value: "" },
        { text: "新建", value: "新建" },
        { text: "确认", value: "确认" },
        { text: "在途", value: "在途" },
        { text: "完成", value: "完成" },
        { text: "作废", value: "作废" },
      ],
      list: [],
      // ulLis: "",
      // ulLiData: "",
      isLoading: true,
      hasMore: true,
      show: false,
      active: "",
      flowData: {
        id: "",
        isReject: false, // isReject 是驳回，因此通过为false
        userId: "",
        userName: "",
        remark: "",
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters["common/userInfo"];
    },
    //获取用vuex中缓存的用户权限
    rights() {
      return this.$store.getters["common/userRights"];
    },
  },
  created() {
    this.getList();
  },
  methods: {
    //获取采购订单列表信息
    async getList() {
      let result = await purchaseListApi(this.query);
      //   console.log(result);
      if (result.code === 200) {
        this.list = [...this.list, ...result.data.rows];
        this.ulLiData = this.list;
        // 是否有更多数据:已经获取的数据和总数对比，如果已经获取的数据等于或小于已经获取的数据则没有更多数据
        this.hasMore = this.query.page * this.query.size < result.data.total;
      }

      // 因为vue赋值是异步的，因此每次加载完成数据以后，要执行一个setTimeout来阻断立即页面刷新的功能
      setTimeout(() => {
        this.isLoading = false;
      });
    },
    // 查询采购单
    async searchEvt(query) {
      console.log(query);
      query.page = 1;
      query.size = 500;
      this.list = [];
      let result = await purchaseListApi(query);
      if (result.code === 200) this.list = result.data.rows;
      console.log(this.list);
    },
    //滚动加载内容
    scrollEvent(eve) {
      //   console.log(this.userInfo);
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
      //   console.log(distance);
      //当用户滚到距离顶部大概16像素的时候就开始加载
      if (distance < 16) {
        this.isLoading = true;
        //因为要获取下一页的数据，因此需要对query.page进行加一
        this.query.page += 1;
        //调用获取数据的接口来获取数据
        this.getList();
      }
    },
    //采购流程
    // 在公司系统中，如果是一份单需要多个用户来进行处理，这样的业务称为流程系统
    // 比如进入公司以后会用到：钉钉中请假、调休这样的业务，OA
    btnEvt(item, type) {
      switch (type) {
        //进入新建采购订单页面
        case "edit":
          this.$router.push({
            path: "/purchase/edit",
            query: { id: item.id },
          });
          break;
        //进入采购订单详情页面
        case "detail":
          this.$router.push({
            path: "/purchase/detail",
            query: { id: item.id },
          });
          break;
        //删除采购订单
        case "delete":
          //确认弹框
          this.$dialog
            .confirm({
              title: "删除确认",
              message: `确认要删除【${item.projectName}】项目的采购订单吗？`,
            })
            .then(async () => {
              let result = await purchaseDeleteApi(item.id);
              //   如果删除成功，不能去请求数据重新渲染，因为数据可能会太多，影响性能，而应该直接把数组中的数据删除即可
              if (result.code === 200) {
                this.list.map((it) => {
                  if (it.id === item.id) it.state = "作废";
                  return it;
                });
                this.$toast.success("删除成功");
              } else {
                this.$toast.fail("删除失败");
              }
            })
            .catch(() => { });
          break;
        //确认采购订单
        case "confirm":
          this.show = true;
          this.active = 1;
          // 需要对当前审批数据进行处理
          this.flowData.id = item.id;
          this.flowData.userId = this.userInfo.id;
          this.flowData.userName = this.userInfo.name;
          this.flowData.remark = "";
          break;
        //在途  订单已发货正在路上运送
        case "inline":
          this.show = true;
          this.active = 2;
          // 需要对当前审批数据进行处理
          this.flowData.id = item.id;
          this.flowData.userId = this.userInfo.id;
          this.flowData.userName = this.userInfo.name;
          this.flowData.remark = "";
          break;
        //完成 订单运输完毕
        case "finish":
          this.show = true;
          this.active = 3;
          // 需要对当前审批数据进行处理
          this.flowData.id = item.id;
          this.flowData.userId = this.userInfo.id;
          this.flowData.userName = this.userInfo.name;
          this.flowData.remark = "";
          break;
        default:
          break;
      }
    },
    //采购流程弹出框的确认按钮
    async confirmEvt() {
      // console.log(this);
      if (!this.flowData.remark) {
        this.$toast("备注信息没有填写");
        return;
      }
      //   更新采购订单状态接口
      let result = await purchaseFlowApi(this.flowData);
      //   console.log('更新采购订单状态',result);
      // 因为不能发起请求，所以状态更新成功以后，需要手动去设置状态
      if (result.code === 200) {
        this.$toast.success("审批成功");
        //如果是驳回，需要去处理，如果是通过也需要进行到下一步
        let states = ["新建", "确认", "在途", "完成"];
        this.list.map((it) => {
          if (it.id === this.flowData.id) {
            //先判断是通过还是驳回,isReject为true时为驳回
            if (this.flowData.isReject) {
              let idx = this.active - 2;
              idx = idx < 0 ? 0 : idx;
              it.state = states[idx];
            } else {
              it.state = states[this.active];
            }
          }
          return it;
        });
        this.show = false;
      } else {
        this.$toast.fail("审批失败，请重试");
      }
    },
    // 用户点击新建采购订单时，执行页面跳转，进行权限拦截
    toNewPage() {
      console.log(this.rights);
      //因为在具体的页面，因此页面的编码可以固定写死
      let myRights = this.rights.find((it) => it.id === "PURCHASE-01-02");
      console.log(myRights);
      //如果权限不存在或没有新建采购订单权限
      if (!myRights || !myRights.role.includes("C")) {
        this.$toast.fail("你没有访问这个页面的权限，无法访问");
      } else {
        this.$router.push("/purchase/edit");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.my-header {
  display: flex;
  height: 49px;
  padding: 8px 12px;
  border-bottom: 2px solid #999999;
  > input {
    flex: 1;
    width: 0;
    height: 32px;
    line-height: 32px;
    border: none;
    outline: none;
    background: #f5f5f5;
    &::-webkit-input-placeholder {
      font-size: 0.7rem;
      color: #777777;
    }
  }

  i {
    flex: 0 0 32px;
    height: 32px;
    margin-left: 12px;
    background: url(../../images/search-icon.png) center center / 26px 26px
      no-repeat;
  }
}
.fontSize {
  font-size: 0.7rem;
}
.approveInp {
  border: 1px solid #dbdbdb;
  padding-left: 0.4rem;
  width: calc(100% - 66px);
  font-size: 0.7rem;
}

.van-radio-group {
  width: calc(100% - 110px);
  display: inline-flex;
  margin: 10px 0;
  font-size: 0.7rem;
}
.remarks {
  margin-right: 14px;
}
textarea {
  width: calc(100% - 66px) !important;
  border: 1px solid #dbdbdb;
  margin-bottom: -14px;
}
.but {
  margin-top: 10px;
  text-align: right;
  padding-right: 10px;
}
.van-button {
  margin-left: 4px;
}
.loadingColor span {
  color: #e56926;
}
</style>