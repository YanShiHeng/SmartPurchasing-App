<template>
  <page-layout :text="`${text}采购单信息`" :showHome="false" :showBack="true">
    <van-form @submit="onSubmit">
      <p class="my-title">基础信息</p>
      <!-- 创建人 -->
      <van-field
        v-model="pageData.createName"
        name="创建人"
        label="创建人"
        readonly
        placeholder="请填写创建人"
      />
      <!-- 创建时间 -->
      <van-field
        v-model="pageData.createTime"
        name="创建时间"
        label="创建时间"
        readonly
        placeholder="请选择创建时间"
        :rules="[{ required: true, message: '请选择创建时间' }]"
      >
        <!-- 表单中的单选框 -->
        <template #button>
          <van-button
            size="small"
            color="#ff5513"
            type="primary"
            native-type="button"
            @click="timeShow = true"
          >
            选择日期
          </van-button>
        </template>
      </van-field>
      <!-- 项目名称 -->
      <van-field
        v-model="pageData.projectName"
        name="项目名称"
        label="项目名称"
        readonly
        placeholder="请选择项目"
        :rules="[{ required: true, message: '请选择项目' }]"
      >
        <!-- 表单中的单选框 -->
        <template #button>
          <van-button
            size="small"
            color="#ff5513"
            type="primary"
            native-type="button"
            @click="pickerOpenEvt('project')"
          >
            选择项目
          </van-button>
        </template>
      </van-field>
      <!-- 材料信息 -->
      <p class="my-title">材料信息</p>
      <!-- 材料名称 -->
      <van-field
        v-model="pageData.materialName"
        name="材料名称"
        label="材料名称"
        readonly
        placeholder="请选择材料"
        :rules="[{ required: true, message: '请选择材料' }]"
      >
        <template #button>
          <van-button
            size="small"
            color="#ff5513"
            native-type="button"
            @click="pickerOpenEvt('material')"
            type="primary"
          >
            选择材料
          </van-button>
        </template>
      </van-field>
      <!-- 采购数量 -->
      <van-field
        v-model.number="pageData.materialWeight"
        type="number"
        name="采购数量"
        label="采购数量"
        placeholder="请填写采购数量"
        :rules="[
          { required: true, message: '请填写采购数量' },
          { validator, message: '请填写正确的数字' },
        ]"
      />
      <!-- 材料单位 -->
      <van-field
        v-model.trim="pageData.materialUnit"
        name="材料单位"
        label="材料单位"
        placeholder="请填写材料单位"
        :rules="[{ required: true, message: '请选择材料' }]"
      />
      <!-- 材料单价 -->
      <van-field
        v-model.number="pageData.price"
        type="number"
        name="单价"
        label="单价"
        placeholder="请填写单价"
        :rules="[
          { required: true, message: '请填写单价' },
          { validator, message: '请填写正确的数字' },
        ]"
      />
      <!-- 供应商信息 -->
      <p class="my-title">供应商信息</p>
      <!-- 供应商名称 -->
      <van-field
        v-model="pageData.supplierName"
        name="供应商名称"
        label="供应商名称"
        readonly
        placeholder="请选择供应商"
        :rules="[{ required: true, message: '请选择供应商' }]"
      >
        <template #button>
          <van-button
            size="small"
            color="#ff5513"
            native-type="button"
            @click="pickerOpenEvt('supplier')"
            type="primary"
            >选择供应商</van-button
          >
        </template>
      </van-field>
      <!-- 联系人 -->
      <van-field
        v-model="pageData.supplierContact"
        name="联系人"
        label="联系人"
        readonly
        placeholder="联系人"
      />
      <!-- 联系电话 -->
      <van-field
        v-model="pageData.supplierPhone"
        name="联系电话"
        label="联系电话"
        readonly
        placeholder="联系电话"
      />
      <!-- 审批信息 -->
      <p class="my-title">审批信息</p>
      <!-- 审批人 -->
      <van-field
        name="审批人"
        label="审批人"
        :value="selectUser.length + '个人'"
        readonly
        placeholder="请选择审批人"
      >
        <template #button>
          <van-button
            size="small"
            color="#ff5513"
            native-type="button"
            @click="pickerOpenEvt('user')"
            type="primary"
            >选择审批人</van-button
          >
        </template>
      </van-field>
      <!-- 备注 -->
      <van-field
        v-model="pageData.remark"
        name="备注"
        label="备注"
        placeholder="请输入备注"
      />
      <div style="margin: 16px">
        <van-button round block color="#ff5513" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
    <!-- 日历组件 -->
    <van-calendar v-model="timeShow" @confirm="timeConfirm" />
    <!-- 弹出框组件 -->
    <dialog-picker
      @pickEvt="pickerEvent"
      :type="dialogType"
      :isDX="isDX"
      :show.sync="dialogShow"
    ></dialog-picker>
  </page-layout>
</template>
<script>
import {
  purchaseInfoApi,
  purchaseSaveApi,
  purchaseUpdateApi,
} from "../../apis/purchaseApi";
// 引入弹出框组件
import DialogPicker from "./DialogPicker.vue";
export default {
  components: { DialogPicker },
  data() {
    return {
      pageData: {
        nextId: "",
        createId: "",
        createName: "",
        createTime: "",
        projectId: "",
        projectName: "",
        materialId: "",
        materialName: "",
        materialUnit: "",
        materialWeight: "",
        price: "",
        supplierId: "",
        supplierName: "",
        supplierContact: "",
        supplierPhone: "",
        remark: "",
      },
      text: "新建",
      timeShow: false,
      dialogShow: false,
      dialogType: "", //每次点击弹出框组件的时候，设置一个类型，组件就知道调用哪个接口的数据，然后进行展示
      isDX: false, //是否多选  这个页面只有在选择审批人的时候才可以多选  即isDX为true
      selectUser: [], //用来保存选中的审批人
    };
  },
  //获取当前页面的登录用户信息
  computed: {
    userInfo() {
      return this.$store.getters["common/userInfo"];
    },
  },
  async created() {
    this.pageData.createId = this.userInfo.id;
    this.pageData.createName = this.userInfo.name;
    //当用户点击的编辑进入此页面时,地址栏传入一个id 此id为采购订单编码
    let id = this.$route.query.id;
    // console.log(id);
    if (!!id) {
      this.text = "编辑";
      //获取采购订单信息
      let result = await purchaseInfoApi(id);
      // console.log(result);
      this.pageData = result.data;
      this.timeConfirm(this.pageData.createTime)
      //因为remark字段是一个数组，因此需要对remark字段进行置空---如果不置空，会导致数据库崩溃
      console.log(this.pageData.remark);
      this.pageData.remark = "";
    }
  },
  methods: {
    // 表单数据校验方法
    validator(val) {
      return !isNaN(val) && val * 1 > 0;
    },
    // 表单提交   表单校验如果没有通过，是不会调用这个方法的
    async onSubmit() {
      //如果选中的审批人个数小于1，停止继续执行
      if (this.selectUser.length < 1) {
        this.$toast("请选择审批人");
        return;
      }
      this.pageData.nextId = this.selectUser.reduce(function (nl, item) {
        nl.push(item);
        return nl;
      }, []);
      // console.log(this.pageData.nextId);
      // 如果url地址中存在id则表示数据处于编辑状态，需要使用编辑接口，否则为新建
      if (!!this.pageData.id) {
        //编辑
        //更改采购订单信息
        let updateRes = await purchaseUpdateApi(this.pageData);
        if (updateRes.code === 200) {
          this.$toast.success("修改采购订单成功");
        } else {
          this.$toast.fail("修改采购订单失败");
        }
      } else {
        //新建
        //保存采购订单信息
        let result = await purchaseSaveApi(this.pageData);
        if (result.code === 200) this.$toast.success("新增采购订单成功");
        else this.$toast.fail("新增采购订单失败");
      }
    },
    //当用户点击选择项目之类的时候确定选择类型  如选择项目、选择供应商等
    pickerOpenEvt(type) {
      this.dialogType = type;
      this.dialogShow = true;
      this.isDX = type === "user"; //当选择审批人的时候为true  即可以多选
    },
    pickerEvent(item, type) {
      // 根据type不同，给不同的数据赋值
      if (type === "project") {
        this.pageData.projectId = item.id;
        this.pageData.projectName = item.name;
      } else if (type === "material") {
        this.pageData.materialId = item.id;
        this.pageData.materialName = item.name;
      } else if (type === "supplier") {
        this.pageData.supplierId = item.id;
        this.pageData.supplierName = item.name;
        this.pageData.supplierContact = item.contact;
        this.pageData.supplierPhone = item.phone;
      } else if (type === "user") {
        this.selectUser = item;
        console.log(this.selectUser);
      }
      this.dialogShow = false;
    },
    //日期格式化
    myDate(val, type) {
      // console.log(arguments)
      // 做一个容错处理，如果用户传递的是null、undefined、''
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
        if (key === "yyyy") return yyyy;
        if (key === "MM") return MM;
        if (key === "DD") return DD;
        if (key === "hh") return hh;
        if (key === "mm") return mm;
        if (key === "ss") return ss;
      });
      // return res
    },
    timeConfirm(val) {
      // console.log(arguments);//会入参一个时间戳
      this.pageData.createTime = this.myDate(val, "yyyy-MM-DD");
      this.timeShow = false;
    },
  },
};
</script>
<style lang="less" scoped>
.my-title {
  font-size: 0.75rem;
  color: #999;
  padding-left: 16px;
  margin: 10px 0;
}
</style>