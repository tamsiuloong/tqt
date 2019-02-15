<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" v-if="isLogin">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p><br>
          <p class="login-tip"> <a @click="loop">注册</a></p>
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
      }).catch(err=>{
        if(err.response.status === 401)
        {
          this.$Message.error('用户名不存在');
        }
        else if(err.response.status === 400){
          this.$Message.error('密码错误');
        }
        else
        {
          this.$Message.error('哦，天啊，未知问题啊，有可能服务器关了吧');
        }
      })
    },
    register({ userName, password,classId,noteUrl,realName }) {
      this.handleRegister({ userName, password,classId,noteUrl,realName }).then(res => {
        if(res.data.code === 1)
        {
          this.isLogin=true;
          this.$Message.success('注册成功，可以登陆了');
        }
        else
        {
          this.$Message.error('注册失败，用户名重复');
        }

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
