<template>
  <Card>
    <Card>
      <Row>

        <Col span="24">
          <Select filterable="true" placeholder="班级" v-model="searchForm.classId"  style="width:200px">
            <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
          </Select>
          <Input v-model="searchForm.stuName" placeholder="请输入..." style="width:200px"/>
          <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
        </Col>

      </Row>
    </Card>

    <br>
    <Row>
        <Button type="primary" iicon="ios-add" @click="addUser()">新建</Button>
        <Button type="success" icon="ios-build" @click="edit()">修改</Button>
        <Button type="error" icon="ios-trash" @click="remove()">删除</Button>
        <Button type="success" icon="ios-build" @click="role()">修改角色</Button>
    </Row>
    <br>
    <Row>
        <Table :loading="tableLoding" border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
    </Row>
    <br>
    <Row>
        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
              align="center"  show-sizer show-total @on-page-size-change="changePageSize"></Page>
    </Row>

    <Modal
            v-model="updateModal"
            title="编辑用户"
            width="80%"
            :mask-closable="true"
            :loading="loading"
            @on-ok="update"
            @on-cancel="cancel">
        <Form ref="updateForm" :model="updateForm" :rules="ruleCustom" :label-width="80">
            <!--<Row>-->
                <!--<Col span="11">-->
                    <!--<FormItem label="所在部门" prop="dept.id">-->
                        <!--<Select v-model="updateForm.dept.id" filterable>-->
                            <!--<Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.deptName }}-->
                            <!--</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</Col>-->
                <!--<Col span="2" style="text-align: center"/>-->
                <!--<Col span="11">-->
                    <!--<FormItem label="直属领导" prop="userInfo.manager.id">-->
                        <!--<Select v-model="updateForm.userInfo.manager.id">-->
                            <!--<Option v-for="item in userList" :value="item.id" :disabled="item.id==updateForm.id"-->
                                    <!--:key="item.id">{{ item.userName }}-->
                            <!--</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</Col>-->
            <!--</Row>-->


            <Row>
                <Col span="11">
                    <FormItem label="登录名" >
                        <Input type="text" readonly v-model="updateForm.userName"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="姓名" prop="userInfo.name">
                        <Input type="text" v-model="updateForm.userInfo.name"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="入职日期" prop="userInfo.joinDate">
                        <DatePicker v-model="updateForm.userInfo.joinDate" format="yyyy-MM-dd" type="date"
                                    placeholder="Select date" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="薪水" prop="userInfo.salary">
                        <Input type="text" v-model="updateForm.userInfo.salary"/>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="11">
                    <FormItem label="等级" prop="userInfo.degree">
                        <Select v-model="updateForm.userInfo.degree" filterable>
                            <Option v-for="item in degreeList" :value="item.value" :key="item.value">{{ item.label
                                }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="性别" prop="userInfo.gender">
                        <RadioGroup v-model="updateForm.userInfo.gender" type="button">
                            <Radio label="true">男</Radio>
                            <Radio label="false">女</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem label="状态" prop="state">
                        <Radio-group v-model="updateForm.state" type="button">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">停用</Radio>
                        </Radio-group>
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
                    <FormItem label="出生年月" prop="userInfo.birthday">
                        <DatePicker type="date" v-model="updateForm.userInfo.birthday" format="yyyy-MM-dd"
                                    placeholder="Select date" style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
            </Row>



          <Row>
            <Col span="11">
              <FormItem label="电话" prop="userInfo.telephone">
                <Input type="text" v-model="updateForm.userInfo.telephone"/>
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
              <FormItem  label="班级">
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
                <Col span="11">

                    <FormItem label="排序号" prop="userInfo.orderNo">
                        <Input type="text" v-model="updateForm.userInfo.orderNo"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="说明" prop="userInfo.remark">
                        <Input type="textarea" v-model="updateForm.userInfo.remark"/>
                    </FormItem>
                </Col>
            </Row>

        </Form>
    </Modal>
    <Modal
            v-model="addModal"
            title="添加用户"
            width="80%"
            @on-ok="add"
            @on-cancel="cancel"
            :loading="loading">
        <Form ref="addForm" :model="addForm" :rules="ruleCustom" :label-width="80">
            <!--<Row>-->
                <!--<Col span="11">-->
                    <!--<FormItem label="所在部门" prop="dept.id">-->
                        <!--<Select v-model="addForm.dept.id" filterable>-->
                            <!--<Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.deptName }}-->
                            <!--</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</Col>-->
                <!--<Col span="2" style="text-align: center"/>-->
                <!--<Col span="11">-->
                    <!--<FormItem label="直属领导" prop="userInfo.manager.id">-->
                        <!--<Select v-model="addForm.userInfo.manager.id" filterable>-->
                            <!--<Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}-->
                            <!--</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</Col>-->
            <!--</Row>-->


            <Row>
                <Col span="11">
                    <FormItem label="登录名" prop="userName">
                        <Input type="text" v-model="addForm.userName" @on-blur="checkUsername"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="姓名" prop="userInfo.name">
                        <Input type="text" v-model="addForm.userInfo.name"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="入职日期" prop="userInfo.joinDate">
                        <DatePicker v-model="addForm.userInfo.joinDate" type="date" placeholder="Select date"
                                    style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="薪水" prop="userInfo.salary">
                        <Input type="text" v-model="addForm.userInfo.salary"/>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="11">
                    <FormItem label="等级" prop="userInfo.degree">
                        <Select v-model="addForm.userInfo.degree" filterable>
                            <Option v-for="item in degreeList" :value="item.value" :key="item.value">{{ item.label
                                }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="性别" prop="userInfo.gender">
                        <RadioGroup v-model="addForm.userInfo.gender" type="button">
                            <Radio label="1">男</Radio>
                            <Radio label="0">女</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem label="状态" prop="state">
                        <Radio-group v-model="addForm.state" type="button">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">停用</Radio>
                        </Radio-group>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="11">
                    <FormItem label="岗位" prop="userInfo.station">
                        <Input type="text" v-model="addForm.userInfo.station"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="电话" prop="userInfo.telephone">
                        <Input type="text" v-model="addForm.userInfo.telephone"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="邮箱" >
                        <Input type="text" v-model="addForm.userInfo.email"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="出生年月" prop="userInfo.birthday">
                        <DatePicker type="date" v-model="addForm.userInfo.birthday" placeholder="Select date"
                                    style="width: 200px"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">

                    <FormItem label="排序号" prop="userInfo.orderNo">
                        <Input type="text" v-model="addForm.userInfo.orderNo"/>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                    <FormItem label="说明" prop="userInfo.remark">
                        <Input type="textarea" v-model="addForm.userInfo.remark"/>
                    </FormItem>
                </Col>
            </Row>

        </Form>
    </Modal>

    <Modal
            v-model="roleModal"
            title="分配角色"
            @on-ok="updateRole"
            @on-cancel="cancel" width="80%">
        <Form ref="roleForm" :model="roleForm" :label-width="80">

            <Row>
                <Col span="11">
                    <FormItem label="登录名" prop="userName">
                        <Input type="text" v-model="roleForm.userName"/>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <FormItem label="角色" prop="roleIds">
                    <CheckboxGroup v-model="roleForm.roleIds">
                        <Checkbox v-for="(role,key) in roleList"  :label="role.id">{{role.name}}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Row>

        </Form>
    </Modal>
    <!--offer管理-->
    <Modal
      v-model="offerModal"
      title="offer管理"
       width="80%" ok-text="关闭">
      <Form ref="offer"  :label-width="80">

        <Row>
          <Col span="24">
              <Table border :columns="offerColumns" :data="offerData"></Table>
          </Col>
        </Row>
        <br>
        <Row>
          <Col span="22">
            <Button type="primary" iicon="ios-add" @click="addOffer()">添加offer</Button>
          </Col>
        </Row>
        <br>
        <Card :title="offerCmd">
        <Row>

            <Col span="22">
            <Form ref="offerForm" :model="offerForm" :label-width="80">
              <Row>
                <Col span="11">
                  <FormItem label="公司名字">
                    <Input type="text" v-model="offerForm.company"/><br>
                  </FormItem>
                </Col>
                <Col span="2"/>
                <Col span="11">
                  <FormItem label="薪资">
                    <InputNumber type="text" number="true" v-model="offerForm.salary"/><br>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                  <Col span="11">
                    <FormItem label="入职日期">
                      <DatePicker type="date" v-model="offerForm.joinDate" placeholder="Select date"
                                  style="width: 200px"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="2"/>
                  <Col span="11">
                    <FormItem label="福利待遇">
                      <Input type="textarea" v-model="offerForm.welfare"/><br>
                    </FormItem>
                  </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="是否入职">
                    <Radio-group v-model="offerForm.isEntry" type="button">
                      <Radio label="true">已入职</Radio>
                      <Radio label="false">放弃</Radio>
                    </Radio-group>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <Button type="success" style="margin-left: 80px" icon="ios-build" @click="saveOffer()">保存数据</Button>
                </Col>
              </Row>
            </Form>
          </Col>

        </Row>
        </Card>
      </Form>

    </Modal>
  </Card>
</template>

<script type="text/ecmascript-6">
  import axios from '@/libs/api.request'
    import formatDate from '../../libs/date';
    import "ztree/js/jquery-1.4.4.min.js"
    import "ztree/js/jquery.ztree.core.min.js"
    import "ztree/js/jquery.ztree.excheck.min.js"
    import "ztree/css/zTreeStyle/zTreeStyle.css"

    export default {
        data() {

            const checkUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                }
                //发送ajax到服务查询该用户名是否存在
                axios.request({
                    url:"/api/user/checkUsername/"+value,
                    method: "get"
                }).then((resp)=>{
                    if(resp.data.code===0)
                    {
                        callback(new Error("用户名已经存在"));
                    }
                    else
                    {
                        callback();
                    }
                })

            };
            return {
                offerCmd:"添加offer",
                offerData:[],
                offerColumns: [
                  {
                    title: '公司',
                    key: 'company'
                  },
                  {
                    title: '薪资',
                    key: 'salary'
                  },
                  {
                    title: '入职日期',
                    key: 'joinDate',
                    render: (h, params) => {
                      let time = "未知";
                      if(params.row.joinDate)
                      {
                        time=params.row.joinDate.substr(0,7);
                      }
                      return h('div', [
                        h('strong', time)
                      ]);
                    }
                  },
                  {
                    title: '是否入职',
                    key: 'isEntry',
                    render: (h, params) => {

                      return h('div', [
                        h('strong', params.row.isEntry?"已入职":"放弃入职")
                      ]);
                    }
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 250,
                    align: 'center',
                    render: (h, params) => {
                      return h('div', [
                        h('Button', {
                          props: {
                            type: 'primary',
                            size: 'small'
                          },
                          style: {
                            marginRight: '5px'
                          },
                          on: {
                            click: () => {
                              this.offerForm = params.row;
                              //数据转换
                              this.offerForm.isEntry = params.row?"true":"false";
                              this.offerCmd = "编辑offer";

                            }
                          }
                        }, '编辑'),
                        h('Button', {
                          props: {
                            type: 'error',
                            size: 'small'
                          },
                          style: {
                            marginRight: '5px'
                          },
                          on: {
                            click: () => {
                              axios.request({
                                url: '/api/offer/entry/'+params.row.id+"/"+(!params.row.isEntry),
                                method: 'put'
                              }).then((result) => {
                                this.loadOffers(this.offerForm.userId);
                                this.$Message.success('操作成功!');
                              }).catch(resp=>{
                                this.$Message.error("网络异常，请稍后再试");
                              });
                            }
                          }
                        }, params.row.isEntry?"取消入职":"确定入职"),
                        h('Button', {
                          props: {
                            type: 'error',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              axios.request({
                                url: '/api/offer',
                                method: 'delete',
                                data:[params.row.id]
                              }).then((result) => {

                                this.offerData.splice(params.index, 1);
                                this.loadOffers(this.offerForm.userId);
                                this.$Message.success('操作成功!');
                              }).catch(resp=>{
                                this.$Message.error("网络异常，请稍后再试");
                              });

                            }
                          }
                        }, '删除')
                      ]);
                    }
                  }
                ],
                offerForm:{
                  company:"",
                  salary:"",
                  joinDate:"",
                  isEntry:"false",
                  welfare:""
                },
                tableLoding:true,
                loading: true,
                count: 0,
                gourpId: null,
                keyWord: "",
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                      title: '名字',
                      key: 'userName',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.userInfo.name)
                        ]);
                      }
                    },
                    {
                      title: '学校',
                      key: 'school',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.userInfo.school)
                        ]);
                      }
                    },
                    {
                      title: '专业',
                      key: 'school',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.userInfo.major)
                        ]);
                      }
                    },
                    {
                      title: '学历',
                      key: 'school',
                      render: (h, params) => {

                        const state = parseInt(params.row.userInfo.education);
                        let stateToStr = "未知";
                        if (state === 4) {
                          stateToStr= "研究生";
                        }
                        else if (state === 3) {
                          stateToStr= "本科";
                        }
                        else if (state === 2) {
                          stateToStr= "大专";
                        }
                        else if (state === 1) {
                          stateToStr= "高中";
                        }


                        return h('div', [
                          h('strong', stateToStr)
                        ]);


                      }
                    },
                    {
                      title: '毕业时间',
                      key: 'school',
                      render: (h, params) => {
                        let graduationTime = "未知";
                        if(params.row.userInfo.graduationTime)
                        {
                          graduationTime=params.row.userInfo.graduationTime.substr(0,7);
                        }
                        return h('div', [
                          h('strong', graduationTime)
                        ]);
                      }
                    }
                    ,
                    {
                      title: '年龄',
                      key: 'school',
                      render: (h, params) => {
                        let age  = "未知";
                        if(params.row.userInfo.birthday)
                        {
                          age=this.computeAge(params.row.userInfo.birthday.substr(0,10));
                        }
                        return h('div', [
                          h('strong', age)
                        ]);
                      }
                    },
                    {
                      title: '笔记地址',
                      key: 'noteUrl',
                      render: (h, params) => {
                        return h('div', [
                          h('a', {

                            on: {
                              click: () => {
                               window.open(params.row.noteUrl);
                              }
                            }
                          },"查看笔记")
                        ]);
                      }
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            const state = parseInt(params.row.state);
                            let stateToStr = "未知";
                            if (state === 0) {
                              stateToStr= "不可用";
                            }
                            else if (state === 1) {
                              stateToStr= "可用";
                            }


                          return h('div', [
                            h('strong', stateToStr)
                          ]);
                        }
                    },
                    {
                      title: '操作',
                      key: 'action',
                      fixed: 'right',
                      width: 160,
                      render: (h, params) => {
                        return h('div', [
                          h('Button', {
                            props: {
                              type: 'info',
                              size: 'small',
                              ghost:''
                            },
                            on: {
                              click: () => {

                                this.loadOffers(params.row.id);

                                this.offerModal = true;
                              }
                            }
                          }, 'offer/入职管理')
                        ]);
                      }
                    }
                ],
                self: this,
                page: {
                  size:20,
                  number:1
                },
                addModal: false,
                updateModal: false,
                offerModal: false,
                roleModal: false,
                addForm: {
                    "dept": {
                        id: ""
                    },
                    "userName": "",
                    "state": "1",
                    "userInfo": {
                        "name": "",
                        "manager": {
                            id: ""
                        },
                        "joinDate": "",
                        "salary": "0",
                        "degree": "4",
                        "gender": "1",
                        "station": "",
                        "telephone": "",
                        "email": "",
                        "birthday": "",
                        "orderNo": "",
                        "remark": ""
                    }
                },
                updateForm: {
                    "dept": {
                        id: ""
                    },
                    "userName": "",
                    "state": "",
                    "classes":{
                      "id":""
                    },
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
                roleForm: {
                    id: "",
                    userName: "",
                    roleIds: {}
                },
                classesList:[],
                deptList: {},
                userList:{},
                roleList:{},
                degreeList:[
                    {
                        value: '0',
                        label: '超级管理员'
                    },
                    {
                        value: '1',
                        label: '跨班级跨人员'
                    },
                    {
                        value: '2',
                        label: '管理所有下属班级和人员'
                    },
                    {
                        value: '3',
                        label: '管理本班级'
                    },
                    {
                        value: '4',
                        label: '普通员工'
                    }
                ],
                ruleCustom: {
                    userName: [
                        { required: true,message:'不能为空', trigger: 'blur' },
                        { validator: checkUsername, trigger: 'blur' }
                    ],
                    "userInfo.email":[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                searchForm:{
                  classId:"",
                  stuName:"",
                },
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
            change(e) {
                if (e.length == 1) {

                    var editUser =e[0];


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


                }
                this.setGroupId(e);
            },
            setGroupId(e) {
                this.groupId = [];
                this.count = e.length;
                for (var i = 0; i < e.length; i++) {
                    this.groupId.push(e[i].id);
                }
            },
            reset(form) {
                this.$refs[form].resetFields();
            },
//显示新建用户对话框
            addUser() {
                this.addModal = true;
            },
//新建用户
            add() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        const user = this.addForm;
                        axios.request({
                            url: '/api/user',
                            method: 'post',
                            data: user,
                            params:{
                                managerId:user.userInfo.manager.id
                            }
                        }).then((result) => {
                            this.gopage(this.page.number);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('操作成功!');
                            this.addModal = false;
                        }).catch(resp=>{
                            this.$Message.error("网络异常，请稍后再试");
                        });
                    }
                    else {
                        this.$Message.error("表单验证失败");
                        setTimeout(() => {
                            this.loading = false;
                            this.$nextTick(() => {
                                this.loading = true;
                            });
                        }, 1000);
                    }
                })
            },
//显示修改用户对话框
            edit() {
                if (this.count != 1) {
                    this.updateModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
                    this.updateModal = true;
                }
            },
//更新用户
            update() {
                this.$refs['updateForm'].validate((valid) => {

                    if (valid) {
                        axios.request({
                            url: '/api/user',
                            method: 'put',
                            data: this.updateForm,
                        }).then((result) => {
                            this.updateModal = false,
                            this.$Message.success('操作成功!');
                            this.gopage(this.page.number);
                        });
                    }
                    else {
                        this.$Message.error("表单验证失败");
                        setTimeout(() => {
                            this.loading = false;
                            this.$nextTick(() => {
                                this.loading = true;
                            });
                        }, 1000);
                    }
                })
            },
//删除用户
            remove() {
                if (this.groupId != null && this.groupId != "") {
                    axios.request({
                        url: '/api/user',
                        method: 'delete',
                        data: this.groupId
                    }).then((result) => {
                        if (result.data.code === 1) {
                            this.$Message.success('操作成功!');
                            this.gopage(this.page.number);
                        }
                    });
                } else {
                    this.$Message.warning('请至少选择一项');
                }
            },
            gopage(pageNo) {
                this.tableLoding=true;
                const pageSize = this.page.size;
                axios.request({
                    url: '/api/user/search',
                    method: 'post',
                    params: {pageNo, pageSize},
                    data:this.searchForm
                }).then((result) => {
                    this.page = result.data.data;
                    this.tableLoding=false;
                });
            },
            cancel() {
                this.$Message.info('点击了取消');
            },
//显示修改角色对话框
            role () {
                if (this.count !== 1) {
                    this.roleModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
//获取到需要修改的用户信息
                    const editData = this.updateForm;
                    this.roleForm.id = editData.id;
                    this.roleForm.userName = editData.userName;

                    this.roleForm.roleIds = new Array();//clean 之前的数据

//将用户中的userSet 转成 roleIds，用于确定哪些角色已经被选中
                    for(let i = 0 ;i < editData.roleSet.length;i++)
                    {
                        this.roleForm.roleIds[i] = editData.roleSet[i].id;
                    }
//显示角色对话框
                    this.roleModal = true;
                }

            },
            //更新角色
            updateRole(){
                const roleForm = this.roleForm;
                axios.request({
                    url: '/api/user/role',
                    method: 'put',
                    data:roleForm
                }).then((result) => {
                    this.$Message.success('操作成功!');
                    this.gopage(this.page.number);
                });
            },
            // ,
            // checkUsername(event){
            //     let username = event.target.value;

            //     console.log();
            // }
          changePageSize(pageSize){
              this.page.size = pageSize;
              this.gopage(this.page.number + 1);
          },
          computeAge(strBirthday) { //传入形式yyyy-MM-dd
            //strBirthday = util.formatTime(strBirthday);转换成yyyy-MM-dd形式
            var returnAge
            var strBirthdayArr = strBirthday.split('-')
            var birthYear = strBirthdayArr[0]
            var birthMonth = strBirthdayArr[1]
            var birthDay = strBirthdayArr[2]
            var d = new Date()
            var nowYear = d.getFullYear()
            var nowMonth = d.getMonth() + 1
            var nowDay = d.getDate()
            if (nowYear == birthYear) {
              returnAge = 0 //同年 则为0岁
            } else {
              var ageDiff = nowYear - birthYear //年之差
              if (ageDiff > 0) {
                if (nowMonth == birthMonth) {
                  var dayDiff = nowDay - birthDay //日之差
                  if (dayDiff < 0) {
                    returnAge = ageDiff - 1
                  } else {
                    returnAge = ageDiff
                  }
                } else {
                  var monthDiff = nowMonth - birthMonth //月之差
                  if (monthDiff < 0) {
                    returnAge = ageDiff - 1
                  } else {
                    returnAge = ageDiff
                  }
                }
              } else {
                returnAge = -1 //返回-1 表示出生日期输入错误 晚于今天
              }
            }
            return returnAge //返回周岁年龄
          },
          loadOffers(userId){
            this.offerForm.userId = userId;
            axios.request({
              url: '/api/offer/uid/'+userId,
              method: 'get'
            }).then((result) => {
              this.offerData = result.data.data;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });
          },
          saveOffer(){
              //判断是什么操作

              if(this.offerCmd==='添加offer')
              {
                axios.request({
                  url: '/api/offer',
                  method: 'post',
                  data: this.offerForm
                }).then((result) => {
                  this.loadOffers(this.offerForm.userId);
                  this.$refs['offerForm'].resetFields();
                  this.offerForm={
                    company:"",
                    salary:"",
                    joinDate:"",
                    isEntry:"false",
                    welfare:"",
                    userId:this.offerForm.userId
                  };
                  this.$Message.success('操作成功!');
                }).catch(resp=>{
                  this.$Message.error("网络异常，请稍后再试");
                });
              }
              else if(this.offerCmd==='编辑offer'){
                axios.request({
                  url: '/api/offer',
                  method: 'put',
                  data: this.offerForm
                }).then((result) => {
                  this.loadOffers(this.offerForm.userId);
                  this.$Message.success('操作成功!');
                }).catch(resp=>{
                  this.$Message.error("网络异常，请稍后再试");
                });
              }
          },
          addOffer(){
            this.offerForm={
              company:"",
              salary:"",
              joinDate:"",
              isEntry:"false",
              welfare:"",
              userId:this.offerForm.userId
            };
            this.offerCmd="添加offer";
          }

        },
        created: function () {
            this.gopage(1);

// //加载所有部门
//             axios.request({
//                 url: '/system/dept/all',
//                 method: 'get',
//
//             }).then((result) => {
//                 this.deptList=result.data.data;
//             });
//
// //加载所有员工（直属领导）
//             axios.request({
//                 url: '/api/user/all',
//                 method: 'get'
//             }).then((result) => {
//                 this.userList=result.data.data;
//             });
//加载角色列表
            axios.request({
                url: '/api/role/all',
                method: 'get'
            }).then((result) => {
                this.roleList = result.data.data;
            });


          axios.request({
            url: '/api/classes/all',
            method: 'get'
          }).then((result) => {
            this.classesList = result.data.data;
          }).catch((result)=>{
            this.$Message.error("哦豁，操作异常："+result);
          });
        }
    }

</script>
