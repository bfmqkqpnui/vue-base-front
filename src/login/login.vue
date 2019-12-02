<template>
  <div>
    <button class="login-page-login-button" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-if="!custom">微信授权登录</button>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>

</style>
