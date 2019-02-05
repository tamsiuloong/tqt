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
            <!--<FormItem label="等级" prop="userInfo.degree">-->
                <!--<Select v-model="updateForm.userInfo.degree" filterable>-->
                  <!--<Option v-for="item in degreeList" :value="item.value" :key="item.value">{{ item.label-->
                  <!--}}-->
                <!--</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="性别" prop="userInfo.gender">
              <RadioGroup v-model="updateForm.userInfo.gender" type="button">
                <Radio label="1">男</Radio>
                <Radio label="0">女</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="电话" prop="userInfo.telephone">
              <Input type="text" v-model="updateForm.userInfo.telephone"/>
            </FormItem>
          </Col>
        </Row>


        <Row>
          <Col span="11">
            <FormItem label="邮箱" prop="userInfo.email">
              <Input type="text" v-model="updateForm.userInfo.email"/>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center"/>
          <Col span="11">
            <FormItem label="出生年月" prop="userInfo.birthday">
              <DatePicker type="date" v-model="updateForm.userInfo.birthday" format="yyyy-MM-dd"
                          placeholder="Select date" style="width: 200px"></DatePicker>
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
          {required: true, message: 'cannot be empty', trigger: 'blur'}
        ],
        "pass":[
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        "passAgain":[
          { validator: this.validatePassword, trigger: 'blur' }
        ]
      }
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
  mounted () {
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
        this.updateForm.userInfo.name=editUser.userInfo.name;
        this.updateForm.userInfo.salary=editUser.userInfo.salary;

        this.updateForm.userInfo.station=editUser.userInfo.station;
        this.updateForm.userInfo.telephone=editUser.userInfo.telephone;
        this.updateForm.userInfo.email=editUser.userInfo.email;
        this.updateForm.userInfo.orderNo=editUser.userInfo.orderNo;
        this.updateForm.userInfo.remark=editUser.userInfo.remark;
        this.updateForm.roleSet=editUser.roleSet;
        //数字转字符
        this.updateForm.state=editUser.state+"";
        this.updateForm.userInfo.degree=editUser.userInfo.degree+"";
        this.updateForm.userInfo.gender=editUser.userInfo.gender+"";
        //日期转字符
        this.updateForm.userInfo.joinDate=formatDate(editUser.userInfo.joinDate);
        this.updateForm.userInfo.birthday=formatDate(editUser.userInfo.birthday);
      }
    });
  }
}
</script>
