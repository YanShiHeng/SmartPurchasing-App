<template>
  <div class="Login">
    <!-- 欢迎页 -->
    <div class="welcomePart" v-if="!showLogin">
      <div class="title">
        <img src="../../images/logo-en.png" alt="" />
        <span>凌动智能采购系统</span>
        <em>{{ welText }}</em>
      </div>
      <!-- 在组件上添加的事件不再是组件的原生事件，需要使用修饰符：'.native' -->
      <van-circle v-model="currentRate" :rate="rate" :clockwise="false" size="36px" @click.native="closeWelcome" :text="`${Math.ceil(currentRate / 20)}`" />
    </div>
    <!-- 登录页 -->
    <div class="login welcomePart" v-else>
      <span class="login-title">凌动智能采购系统</span>
      <div class="login-item">
        <!-- {phone: this.phone, vdtCode: this.vdtCode} => loginObj = {Phone, vdtCode} -->
        <input type="text" v-model="loginObj.phone" placeholder="输入登录手机号" />
      </div>
      <div class="login-item code">
        <input type="text" v-model="loginObj.vdtCode" placeholder="输入验证码" />
        <span @click="getVdtCodeEvt">{{ codeText }}</span>
      </div>
      <van-checkbox v-model="remember" checked-color="#ff5513">记住手机号？</van-checkbox>
      <van-checkbox v-model="auto" checked-color="#ff5513">七天免登录？</van-checkbox>
      <van-button type="primary" @click="loginEvt" block color="#ff5513">登录</van-button>
    </div>
    <div class="foot">&copy; copy right</div>
  </div>
</template>
<script>
import {
  autoLoginApi,
  loginApi,
  userInfoApi,
  vdtCodeApi,
  userRoleApi,
} from "../../apis/userApi";
export default {
  data() {
    return {
      showLogin: false,
      currentRate: 0,
      rate: 100,
      //欢迎页面倒计时定时器和登录页面重新获取验证码计时器
      welcomeTimer: null,
      vdtCodeTimer: null,
      // 自动登录业务是否已完成，如果完成，用户点击倒计时可以跳转到首页
      // init是初始化的值，如果为init用户则不能点击倒计时，如果为home则可以跳转到首页，为login展示登录页面
      autoFinish: "init",
      //登录用户验证码
      loginObj: {
        vdtCode: "",
        phone: "",
      },
      //记住手机号，自动登录
      remember: false,
      auto: false,
      codeText: "获取验证码",
      welText: [
        "渐寒 揣着喜庆的年",
        "情迷 有巧克力芬芳",
        "微暖 花出豆蔻意浅",
        "鹅黄 林徽因的晴天",
        "初夏 送了春的婉转",
        "离殇 一曲青春飞扬",
        "炎炎 宛若你的张狂",
        "芬芳 桂花羹与蜜糖",
        "旖旎 谁与谁的迷藏",
        "枫红 灼了彷徨的眼",
        "寒入 思念如雪飞扬",
        "弥彰 假装遗忘的慌",
      ][new Date().getMonth()],
    };
  },
  async created() {
    //读取自动登录标识，如果存在--需要对token进行缓存，然后发起请求
    let autoToken = localStorage.getItem("auto-Token");
    //读取记住手机号标识
    let rememberPhone = localStorage.getItem("remember-Phone");
    this.remember = !!rememberPhone;

    //自动登录标识存在
    if (!!autoToken) {
      this.$store.commit("common/tokenMut", autoToken);
      // console.log(this.$store.getters["common/tokenMut"]);
      let result = await autoLoginApi();
      // console.log('自动登录标识',autoToken);
      // console.log("自动登录请求结果------", result);
      //如果用户自动免登录成功
      if (result.code === 200) {
        // 缓存用户信息
        this.$store.commit("common/userInfoMut", result.data);
        //获取并缓存用户角色权限信息
        this.getUserRights(userInfo.data.role);
        this.autoFinish = "home";
      } else {
        //用户自动免登录不成功
        this.autoFinish = "login";
        //如果有记住手机号标识，则需要给loginObj.phone赋值
        if (rememberPhone) this.loginObj.phone = rememberPhone;
      }
    } else {
      //自动登录标识不存在
      this.autoFinish = "login";
      //如果有记住手机号标识，则需要给loginObj.phone赋值
      if (rememberPhone) this.loginObj.phone = rememberPhone;
    }
    this.loop(); //倒计时
  },
  methods: {
    //登录点击事件
    async loginEvt() {
      // 校验手机号
      if (!/^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone)) {
        this.$toast({
          message: "手机号码输入错误",
          position: "bottom",
        });
        return;
      }

      // 校验验证码
      if (!/^[0-9]{4}$/.test(this.loginObj.vdtCode)) {
        this.$toast({
          message: "验证码输入错误",
          position: "bottom",
        });
        return;
      }
      //vant组件加载效果
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 发送登录请求，校验用户手机号和验证码是否匹配
      let result = await loginApi(this.loginObj);
      this.$toast.clear();

      console.log("发送登录请求，校验用户手机号和验证码是否匹配", result);
      // 因为这里是处理失败的结果，可以是return终止业务
      if (result.code !== 200) {
        this.$toast.fail("登录失败，原因：" + result.message);
        return;
      }

      // 缓存token到vuex中
      this.$store.commit("common/tokenMut", result.data.token);

      //如果记住手机号被选中，缓存其标识
      if (this.remember) {
        localStorage.setItem("remember-Phone", this.loginObj.phone);
      } else {
        localStorage.removeItem("remember-Phone");
      }
      //如果七天免登录被选中，缓存其标识
      if (this.auto) {
        localStorage.setItem("auto-Token", result.data.token);
      } else {
        localStorage.removeItem("auto-Token");
      }
      // 获取当前用户信息，缓存到vuex中
      let userInfo = await userInfoApi(result.data.id);
      if (userInfo.code === 200) {
        this.$store.commit("common/userInfoMut", userInfo.data);
      }
      //获取并缓存用户角色权限信息
      this.getUserRights(userInfo.data.role);
      console.log("当前用户信息", userInfo);
      //登录成功，跳转到首页
      this.$router.push("/home");
    },
    //欢迎页面倒计时
    loop() {
      this.welcomeTimer = setInterval(() => {
        if (this.rate < 0) {
          clearInterval(this.welcomeTimer);
          if (this.autoFinish === "login") this.showLogin = true;
          else this.$router.push("/home");
          return;
        }
        this.rate -= 1;
        // console.log(111);
      }, 50);
    },
    //关闭欢迎页面
    closeWelcome() {
      clearInterval(this.welcomeTimer);
      //点击倒计时时判断autoFinish  为home跳转到首页，为login跳转到登录页
      if (this.autoFinish === "home") {
        this.$router.push("/home");
      } else {
        this.showLogin = true;
      }
    },
    //点击获取验证码
    async getVdtCodeEvt() {
      //实现节流  如果用户已经点击了获取验证码，则在一定时间内点击无效
      if (this.codeText !== "获取验证码") return;
      //检验手机号是否正确
      if (!/^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone)) {
        //不正确
        this.$toast({
          message: "手机号码输入错误",
          position: "bottom",
        });
        return;
      }
      // 发起获取验证码请求
      let result = await vdtCodeApi(this.loginObj.phone);
      console.log("获取验证码", result);

      //如果可以获取验证码，应该设置codeText，实现节流
      let num = 60;
      if (result.code === 200) {
        this.$toast.success(`获取验证码成功，验证码为${result.data.vdtCode}`);

        this.vdtCodeTimer = setInterval(() => {
          if (num < 0) {
            this.codeText = "获取验证码";
            clearInterval(this.vdtCodeTimer);
            return;
          }
          this.codeText = `重新获取${num}s`;
          num -= 1;
        }, 1000);
      } else {
        this.codeText = "获取验证码";
        this.$toast({
          message: result.message,
          position: "bottom",
        });
      }
    },
    // 获取用户角色权限信息方法
    async getUserRights(ids) {
      let result = await userRoleApi(ids);
      console.log("用户角色权限信息", result);
      if (result.code === 200) {
        this.$store.commit("common/mutationRights", result.data);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
