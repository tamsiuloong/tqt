<template>
    <Card>
      <Card>
        <Row>

          <Col span="24">
            <Select filterable="true" placeholder="班级" v-model="searchForm.classId" @on-change="initStuList" style="width:200px">
              <Option v-for="c in classesList" :value="c.id">{{c.name}}</Option>
            </Select>
            <Select filterable="true" v-model="searchForm.stuName" placeholder="学生" style="width:200px">
              <Option v-for="s in stuList" :value="s.userInfo.name">{{s.userInfo.name}}</Option>
            </Select>
            <Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button>
          </Col>

        </Row>
      </Card>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addTrack()">新建</Button>
                    <!--<Button type="success" icon="ios-build" @click="edit()">修改</Button>-->
                    <!--<Button type="error" icon="ios-trash" @click="remove()">删除</Button>-->
        </Row>
        <br>
        <Row>
                        <Table border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page :total="totalCount" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center"></Page>
        </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加学员信息跟踪"
                :mask-closable="false"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="60%">
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
                <!--一次性取两个元素放在row集合中 -->
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="班级" >
                              <Select filterable="true" placeholder="班级" style="width:200px" @on-change="initStuList">
                                <Option v-for="c in classesList" :value="c.id">{{c.name}}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                              <FormItem label="学生" prop="user.id">
                                <Select filterable="true" v-model="addForm.user.id" placeholder="学生" style="width:200px">
                                  <Option v-for="s in stuList" :value="s.id">{{s.userInfo.name}}</Option>
                                </Select>
                              </FormItem>

                            </Col>
                    </Row>

                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="22">
                        <FormItem label="状态">
                          <Select filterable="true" v-model="addForm.status" placeholder="学生" style="width:200px">
                            <Option v-for="s in statusList" :value="s.id">{{s.name}}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                    </Row>
              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <FormItem label="描述" prop="description">
                    <Input type="textarea" v-model="addForm.description"/>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
              </Row>
            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑学员信息跟踪"
                :mask-closable="false"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="60%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

                    <Row>
                            <Col span="11">
                            <FormItem label="" prop="id">
                                <Input type="text" v-model="updateForm.id"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="描述" prop="description">
                                <Input type="text" v-model="updateForm.description"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="学生" prop="userId">
                                <Input type="text" v-model="updateForm.userId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="创建日期" prop="createTime">
                                <Input type="text" v-model="updateForm.createTime"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="创建者" prop="createBy">
                                <Input type="text" v-model="updateForm.createBy"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="状态" prop="status">
                                <Input type="text" v-model="updateForm.status"/>
                            </FormItem>
                            </Col>
                    </Row>

            </Form>
        </Modal>
    </Card>
</template>

<script type="text/ecmascript-6">
    // import fetch from '../../utils/fetch';
    // import {dateFormat} from '../../utils/date';
    import axios from '@/libs/api.request'
    export default {
        data() {
            return {
                loading:true,
                count: 0,
                gourpId: null,
                pageSize: 20,
                pageNo: 1,
                totalPage: 0,
                totalCount: 0,
                keyWord:"",
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                      title: '学生',
                      key: 'userId',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.user.userInfo.name)
                        ]);
                      }
                    },
                    {
                      title: '状态',
                      key: 'status',
                      render: (h, params) => {
                        const status = parseInt(params.row.status);
                        let statusToStr = "未知";
                        if (status === 1) {
                          statusToStr= "糟糕";
                        }
                        else if (status === 2) {
                          statusToStr= "不好";
                        }
                        else if (status === 3) {
                          statusToStr= "一般";
                        }
                        else if (status === 4) {
                          statusToStr= "良好";
                        }
                        return h('div', [
                          h('strong', statusToStr)
                        ]);
                      }
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                      title: '时间',
                      key: 'createTime',
                      width: 160
                    },
                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        id:"",
                        description:"",
                        user:{
                          id:""
                        },
                        status:""
                },
                addForm: {
                        description:"",
                        user:{
                          id:""
                        },
                        status:3
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    description: [
                        {required: true, message:'描述不能为空',trigger:'blur'}
                    ]
                    ,
                    "user.id": [
                        {required: true, message:'学生不能为空',trigger:'blur'}
                    ]
                    ,
                    createTime: [
                        {required: true, message:'创建日期不能为空',trigger:'blur'}
                    ]
                    ,
                    createBy: [
                        {required: true, message:'创建者不能为空',trigger:'blur'}
                    ]
                    ,
                    "status": [
                        {required: true, message:'状态不能为空',trigger:'blur'}
                    ]
                },
                classesList:[],
                stuList:[],
                statusList:[
                  {id:1,name:"糟糕"},
                  {id:2,name:"不好"},
                  {id:3,name:"一般"},
                  {id:4,name:"良好"}
                ],
                searchForm:{
                  classId:"",
                  stuName:"",
                }
            }
        },
        methods: {
            change(e){
                this.count = e.length;
                if (e.length == 1) {
                    this.updateForm = e[0];
                }
                this.setGroupId(e);
            },
            setGroupId(e)
            {
                this.groupId = [];

                for (var i = 0; i < e.length; i++) {
                    this.groupId.push(e[i].id);
                }
            },
            reset(form){
                this.$refs[form].resetFields();
            },
            addTrack(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const track = this.addForm;
                        axios.request({
                            url: '/api/track',
                            method: 'post',
                            data: track
                        }).then((result) => {
                            this.gopage(this.pageNo);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('操作成功!');
                            this.addModal = false;
                        });
                    }
                    else
                    {
                        this.$Message.error("表单验证失败");
                        setTimeout(()=>{
                            this.loading=false;
                            this.$nextTick(()=>{
                                this.loading=true;
                            });
                        },1000);
                    }
                })
            },
            edit () {
                if (this.count != 1) {
                    this.updateModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
                    this.updateModal = true;
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        axios.request({
                            url: '/api/track',
                            method: 'put',
                            data: this.updateForm
                        }).then((result) => {
                            this.updateModal = false,
                                    this.$Message.success('操作成功!');
                            this.gopage(this.pageNo);
                        }).catch((result)=>{
                            this.$Message.error("操作异常："+result);
                        });
                    }
                    else
                    {
                        this.$Message.error("表单验证失败");
                        setTimeout(()=>{
                            this.loading=false;
                            this.$nextTick(()=>{
                                this.loading=true;
                            });
                        },1000);
                    }
                })
            },
            remove () {
                if (this.groupId != null && this.groupId != "") {
                    axios.request({
                        url: '/api/track',
                        method: 'delete',
                        data: this.groupId
                    }).then((result) => {
                        if (result.data.code === 1) {
                            this.$Message.success('操作成功!');
                            this.gopage(this.pageNo);
                        }
                    }).catch((result)=>{
                        this.$Message.error("操作异常："+result);
                    });
                } else {
                    this.$Message.warning('请至少选择一项');
                }
            },
            gopage(){
                const pageNo = this.pageNo;
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/track/search',
                    method: 'post',
                    params: {pageNo, pageSize,keyWord},
                    data:this.searchForm
                }).then((result) => {
                    this.page = result.data.data;
                }).catch((result)=>{
                    this.$Message.error("操作异常："+result);
                });
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            initStuList(classId){
              axios.request({
                url: '/api/user/stu_list/'+classId,
                method: 'get'
              }).then((result) => {
                this.stuList = result.data.data;
              }).catch((result)=>{
                this.$Message.error("操作异常："+result);
              });
            }
        },
        mounted: function () {
          axios.request({
            url: '/api/classes/all',
            method: 'get'
          }).then((result) => {
            this.classesList = result.data.data;
          }).catch((result)=>{
            this.$Message.error("操作异常："+result);
          });

            this.gopage();
        }
    }


</script>
