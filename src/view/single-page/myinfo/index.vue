<template>
  <Card shadow>
    <div>
      <Form ref="updateForm" :model="updateForm" :rules="ruleCustom" :label-width="80">

        <Row>
          <Col span="11">
            <FormItem label="登录名" >
              <Input type="text" disabled="" v-model="updateForm.userName"/>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="姓名" >
              <Input type="text" v-model="updateForm.userInfo.name"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="密码" prop="password">
              <Input type="text" v-model="updateForm.password"/>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="确认密码" prop="passAgain">
              <Input type="text" v-model="updateForm.passAgain"/>
            </FormItem>
          </Col>
        </Row>

        <Row>

          <Col span="11">
            <FormItem label="性别" prop="userInfo.gender">
              <RadioGroup v-model="updateForm.userInfo.gender" type="button">
                <Radio label="true">男</Radio>
                <Radio label="false">女</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="电话" prop="userInfo.telephone">
              <Input type="text" v-model="updateForm.userInfo.telephone"/>
            </FormItem>
          </Col>
        </Row>


        <Row>
          <Col span="11">
            <FormItem label="邮箱" >
              <Input type="text" v-model="updateForm.userInfo.email"/>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="手机">
              <Input v-model="updateForm.userInfo.telephone" placeholder="请输入手机">
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11" >
            <FormItem label="毕业学校">
              <Input v-model="updateForm.userInfo.school" placeholder="请输入学校">
              </Input>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="专业">
              <Input v-model="updateForm.userInfo.major" placeholder="请输入专业">
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="学历">
              <Select v-model="updateForm.userInfo.education" style="width:200px" placeholder="请选择学历">
                <Option v-for="c in educationList"  :value="c.value">{{c.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="工作经历">
              <Select v-model="updateForm.userInfo.experience" style="width:200px">
                <Option v-for="c in workExperienceList" placeholder="工作经历"  :value="c.value">{{c.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="生日">
              <DatePicker type="date" v-model="updateForm.userInfo.birthday" placeholder="请输入生日" format="yyyy-MM" style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">

            <FormItem label="毕业时间">
              <DatePicker type="date" v-model="updateForm.userInfo.graduationTime" placeholder="请输入毕业时间" format="yyyy-MM" style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem prop="classes.id" label="班级">
              <Select v-model="updateForm.classes.id" style="width:200px"  placeholder="请选择班级">
                <Option v-for="c in classesList" :value="c.id">{{c.name+'期_'+c.type+'班'}}</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="2" style="text-align: center"/>


          <Col span="11">
            <FormItem label="笔记地址">
              <Input type="textarea" v-model="updateForm.noteUrl" placeholder="笔记地址">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
              </Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Button type="success" @click="updateInfo">保存</Button>
        </Row>
      </Form>
    </div>
  </Card>
</template>

<script>
import formatDate from '../../../libs/date';
import axios from '@/libs/api.request'
export default {
  name: 'myinfo',
  data () {
    return {
      updateForm: {
        "dept": {
          id: ""
        },
        "userName": "",
        "state": "",
        "password":"",
        "passAgain":"",
        "userInfo": {
          "name": "",
          "manager": {
            id: ""
          },
          "joinDate": "",
          "salary": "",
          "degree": "",
          "gender": "",
          "station": "",
          "telephone": "",
          "email": "",
          "birthday": "",
          "orderNo": "",
          "remark": ""
        }
      },
      ruleCustom: {
        "userInfo.email":[
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        "pass":[
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        "passAgain":[
          { validator: this.validatePassword, trigger: 'blur' }
        ]
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
  methods: {
    updateInfo:function () {
      this.$refs.updateForm.validate((valid) => {
          if (valid) {
            axios.request({
              url: 'api/user/updateMyInfo',
              method: 'put',
              data: this.updateForm
            }).then((resp)=>{
              if(resp.data.code === 1 )
              {
                this.$Message.success('保存成功!');
              }
              else {
                this.$Message.error('不知道为什么，失败鸟，可能这就是命，命能改吗？');
              }
            })
          }
      })
    },
    validatePassword  (rule, value, callback)  {
      if (this.updateForm.password !== this.updateForm.passAgain) {
        callback(new Error('密码和确认密码要一致哦!'));
      } else {
        callback();
      }
    }

  },
  created () {
    axios.request({
      url: '/api/user/myinfo',
      method: 'get'
    }).then((result) => {

      let editUser =result.data.data;

      // 手动赋值的原因：userInfo中的manager不会转换成json，单独传了一个managerId过来
      if(editUser.managerId!=undefined)
      {
        this.updateForm.userInfo.manager.id= editUser.managerId;
      }
      if(editUser.dept!=undefined)
      {
        this.updateForm.dept.id=editUser.dept.id;
      }
      if(editUser.userInfo != undefined)
      {


        this.updateForm.userName=editUser.userName;
        this.updateForm.id=editUser.id;
        this.updateForm.noteUrl=editUser.noteUrl;
        // this.updateForm.userInfo.name=editUser.userInfo.name;
        // this.updateForm.userInfo.salary=editUser.userInfo.salary;
        //
        // this.updateForm.userInfo.station=editUser.userInfo.station;
        // this.updateForm.userInfo.telephone=editUser.userInfo.telephone;
        // this.updateForm.userInfo.email=editUser.userInfo.email;
        // this.updateForm.userInfo.orderNo=editUser.userInfo.orderNo;
        // this.updateForm.userInfo.remark=editUser.userInfo.remark;
        this.updateForm.userInfo = editUser.userInfo;
        this.updateForm.roleSet=editUser.roleSet;
        if(editUser.classes)
        {
          this.updateForm.classes=editUser.classes;
        }
        else
        {
          this.updateForm.classes={id:""};
        }
        //数字转字符
        this.updateForm.state=editUser.state+"";
        this.updateForm.userInfo.degree=editUser.userInfo.degree+"";
        this.updateForm.userInfo.gender=editUser.userInfo.gender+"";
        this.updateForm.userInfo.education=editUser.userInfo.education+"";
        this.updateForm.userInfo.experience=editUser.userInfo.experience+"";
        //日期转字符
        this.updateForm.userInfo.joinDate=formatDate(editUser.userInfo.joinDate);
        this.updateForm.userInfo.birthday=formatDate(editUser.userInfo.birthday);
      }
    });


    axios.request({
      url: '/api/classes/all',
      method: 'get'
    }).then((result) => {
      this.classesList = result.data.data;
    }).catch((result)=>{
      this.$Message.error("操作异常："+result);
    });
  }
}
</script>
