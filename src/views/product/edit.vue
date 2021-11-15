<template>
  <div>
    材料编辑页面
    <p>
      <button @click="backEvt">返回</button>
    </p>
  </div>
</template>
<script>
export default {
  // 页面拦截
  beforeRouteLeave (to, from, next) {
    const flag = confirm('确定要放弃本次编辑吗?')
    if (flag) next()
  },
  methods: {
    backEvt () {
      this.$router.go(-1)
    }
  }
}
</script>
