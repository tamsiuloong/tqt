<template>
  <Form ref="registerForm" :model="registerForm" :rules="rules" @keydown.enter.native="handleSubmit">
    <Row>
      <Col span="11">
        <FormItem prop="userName">
          <Input v-model="registerForm.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
          </Input>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem prop="userInfo.name">
          <Input v-model="registerForm.userInfo.name" placeholder="请输入姓名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
          </Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem prop="password">
          <Input type="password" v-model="registerForm.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
          </Input>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem prop="passwordAgain">
          <Input type="password" v-model="registerForm.passwordAgain" placeholder="请输入确认密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
          </Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem prop="classes.id">
          <Select v-model="registerForm.classes.id" style="width:200px"  placeholder="请选择班级">
            <Option v-for="c in classesList" :value="c.id">{{c.name+'期_'+c.type+'班'}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem>
          <Select v-model="registerForm.userInfo.gender" style="width:200px" placeholder="请选择性别">
            <Option v-for="c in genderList"  :value="c.value">{{c.label}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="11">
        <FormItem >
          <Input v-model="registerForm.userInfo.school" placeholder="请输入学校">
          </Input>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem>
          <Input v-model="registerForm.userInfo.major" placeholder="请输入专业">
          </Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem>
          <Select v-model="registerForm.userInfo.education" style="width:200px" placeholder="请选择学历">
            <Option v-for="c in educationList"  :value="c.value">{{c.label}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem>
          <Select v-model="registerForm.userInfo.experience" style="width:200px">
            <Option v-for="c in workExperienceList" placeholder="工作经历"  :value="c.value">{{c.label}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem>
          <DatePicker type="date" v-model="registerForm.userInfo.birthday" placeholder="请输入生日" registerFormat="yyyy-MM" style="width: 200px"></DatePicker>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">

        <FormItem>
          <DatePicker type="date" v-model="registerForm.userInfo.graduationTime" placeholder="请输入毕业时间" registerFormat="yyyy-MM" style="width: 200px"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem>
          <Input v-model="registerForm.userInfo.telephone" placeholder="请输入手机">
          </Input>
        </FormItem>
      </Col>
      <Col span="2" style="text-align: center"/>
      <Col span="11">
        <FormItem >
          <Input type="textarea" v-model="registerForm.noteUrl" placeholder="笔记地址">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
          </Input>
        </FormItem>
      </Col>
    </Row>


    <Row>
      <Col span="22">
        <FormItem>
          <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
      </Col>
    </Row>










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

      registerForm: {
        userName:'',
        password:'',
        passwordAgain:'',
        classes:{
          id:''
        },
        noteUrl:'',
        userInfo:{
          name: '',
          gender:'true',
          major:'',
          experience:'false',
          education:'',
          graduationTime:'',
          telephone:'',
          school:''
        }
      },
      classesList:[],
      genderList: [
        {
          value: 'true',
          label: '男'
        },
        {
          value: 'false',
          label: '女'
        }
      ],
      workExperienceList: [
        {
          value: 'true',
          label: '有工作经历'
        },
        {
          value: 'false',
          label: '无工作经历'
        }
      ],
      educationList:[
        {
          value: '4',
          label: '研究生'
        },
        {
          value: '3',
          label: '本科'
        },
        {
          value: '2',
          label: '大专'
        },
        {
          value: '1',
          label: '高中'
        }
      ]
    }
  },
  computed: {

    rules () {
      return {
        userName:[
          { validator: this.registerForm.userName, trigger: 'blur' }
        ],
        "userInfo.name": this.realNameRules,
        password: this.passwordRules,
        "classes.id": this.classIdRules,
        noteUrl: this.noteUrlRules,
        "passwordAgain":[
          { validator: this.validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', this.registerForm)

        }
      })
    },
    validatePassCheck  (rule, value, callback)  {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
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
