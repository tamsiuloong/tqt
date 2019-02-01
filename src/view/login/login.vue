<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" v-if="isLogin">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可<a @click="loop">注册</a></p>
        </div>
      </Card>
    </div>
  </div>
  <div class="login" v-else="!isLogin">
    <div class="login-con">
      <Card icon="log-in" title="写填写基本信息" :bordered="false">
        <div class="form-con">
          <register-form @on-success-valid="register"></register-form>
          <p class="login-tip"><a @click="loop">直接登陆</a></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import RegisterForm from '_c/register-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
   return {
    isLogin:true
   }
  },
  methods: {
    ...mapActions([
      'handleRegister',
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    },
    register({ userName, password,classId,noteUrl,realName }) {
      this.handleRegister({ userName, password,classId,noteUrl,realName }).then(res => {
        this.isLogin=true;
        alert("注册成功，可以登陆了！");
      })
    },
    loop() {
     this.isLogin=!this.isLogin;
    }
  }
}
</script>

<style>

</style>
