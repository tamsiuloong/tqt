<template>
  <Form ref="registerForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="realName">
      <Input v-model="form.realName" placeholder="请输入名字">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="passwordAgain">
      <Input type="password" v-model="form.passwordAgain" placeholder="请确认密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>

    <FormItem prop="classId">
        <Select v-model="form.classId" style="width:200px">
          <Option v-for="c in classesList" :value="c.id">{{c.name+'期_'+c.type+'班'}}</Option>
        </Select>
    </FormItem>
    <FormItem >
      <Input type="textarea" v-model="form.noteUrl" placeholder="笔记地址">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>

    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  name: 'RegisterForm',
  props: {
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    classIdRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '班级不能为空', trigger: 'blur' }
        ]
      }
    },
    noteUrlRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '笔记地址不能为空', trigger: 'blur' }
        ]
      }
    },
    realNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '真实名字不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {

    return {
      form: {
        realName: '',
        userName: '',
        password: '',
        passwordAgain:'',
        classId:'',
        noteUrl:''
      },
      classesList:[]
    }
  },
  computed: {

    rules () {
      return {
        userName:[
          { validator: this.checkUsername, trigger: 'blur' }
        ],
        realName: this.realNameRules,
        password: this.passwordRules,
        classId: this.classIdRules,
        noteUrl: this.noteUrlRules,
        passwordAgain:[
          { validator: this.validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            classId: this.form.classId,
            noteUrl: this.form.noteUrl,
            realName: this.form.realName,
          })

        }
      })
    },
    validatePassCheck  (rule, value, callback)  {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次密码要一致哦!'));
      } else {
        callback();
      }
    },
    checkUserrealName  (rule, value, callback)  {
      if (value === '') {
        callback(new Error('用户名不可以为空塞!'));
      }
      else
      {
        axios.request({
          url: '/api/user/checkUsername/'+value,
          method: 'get'
        }).then((result) => {
          if(result.data.code === 1)
          {
            callback();
          }
          else
          {
            callback(new Error('换一个哦，有个哥老官抢先了!'));
          }
        }).catch((result)=>{
          this.$Message.error("操作异常："+result);
        });
      }

    }
  },
  created:function () {
    axios.request({
      url: '/api/classes/all/false',
      method: 'get'
    }).then((result) => {
      this.classesList = result.data.data;
    }).catch((result)=>{
      this.$Message.error("操作异常："+result);
    });
  }
}
</script>
