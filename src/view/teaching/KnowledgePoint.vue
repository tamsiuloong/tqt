<template>
    <Card>
        <Row>
            <Col span="22">
              所属课程：<Select v-model="courseId" style="width:200px" filterable >
                <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
               知识点名字： <Input v-model="keyWord" placeholder="请输入知识点..." style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(pageNo)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addKnowledgePoint()">新建</Button>
                    <Button type="success" icon="ios-build" @click="edit()">修改</Button>
                    <Poptip
            confirm
            title="确定要删除选中的内容吗?"
            @on-ok="remove()" placement="bottom-start">
            <Button type="error" icon="ios-trash" >删除</Button>
          </Poptip>
        </Row>
        <br>
        <Row>
                        <Table border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center" show-total></Page>
        </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加知识点"
                :mask-closable="false"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="60%">
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="22">
                        <FormItem label="所属课程" prop="course.id">
                          <Select v-model="addForm.course.id" style="width:200px" filterable >
                            <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                    </Row>
                      <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="22">
                            <FormItem label="知识点" prop="name">
                                <Input type="textarea" placeholder="批量写入知识点,以,隔开" v-model="addForm.name"/>
                            </FormItem>
                            </Col>
                    </Row>

            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑知识点"
                :mask-closable="false"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="60%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <FormItem label="所属课程" prop="course.id">
                    <Select v-model="updateForm.course.id" style="width:200px" filterable >
                      <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
              </Row>
              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <FormItem label="知识点" prop="name">
                    <Input type="textarea" placeholder="批量写入知识点,以,隔开" v-model="updateForm.name"/>
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
                courseList:[
                  {
                    id:"",
                    name:"--所有--"
                  }
                ],
                loading:true,
                count: 0,
                gourpId: null,
                pageSize: 20,
                pageNo: 1,
                totalPage: 0,
                totalCount: 0,
                keyWord:"",
                courseId:"",
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '知识点',
                        key: 'name'
                    },
                    {
                        title: '所属课程',
                        key: 'courseId',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.course.name)
                          ]);
                        }
                    }
                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        id:"",
                        name:"",
                        course:{
                          id:""
                        }
                },
                addForm: {
                        name:"",
                        course:{
                          id:""
                        }
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    name: [
                        {required: true, message:'知识点不能为空',trigger:'blur'}
                    ]
                    ,
                    'course.id': [
                        {required: true, message:'所属课程不能为空',trigger:'blur'}
                    ]
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
            addKnowledgePoint(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const knowledgePoint = this.addForm;
                        axios.request({
                            url: '/api/knowledgePoint',
                            method: 'post',
                            data: knowledgePoint
                        }).then((result) => {
                            this.gopage(this.pageNo);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('Success!');
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
                            url: '/api/knowledgePoint',
                            method: 'put',
                            data: this.updateForm
                        }).then((result) => {
                            this.updateModal = false,
                                    this.$Message.success('Success!');
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
                        url: '/api/knowledgePoint',
                        method: 'delete',
                        data: this.groupId
                    }).then((result) => {
                        if (result.data.code === 1) {
                            this.$Message.success('Success!');
                            this.gopage(this.pageNo);
                        }
                    }).catch((result)=>{
                        this.$Message.error("操作异常："+result);
                    });
                } else {
                    this.$Message.warning('请至少选择一项');
                }
            },
            gopage(pageNo){
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                const courseId = this.courseId;
                axios.request({
                    url: '/api/knowledgePoint',
                    method: 'get',
                    params: {pageNo, pageSize,keyWord,courseId}
                }).then((result) => {
                    this.page = result.data.data;
                }).catch((result)=>{
                    this.$Message.error("操作异常："+result);
                });
            },
            cancel () {
                this.$Message.info('点击了取消');
            }
        },
        mounted: function () {
            this.gopage(1);
          //courseList
          axios.request({
            url: '/api/course/all',
            method: 'get'
          }).then((result) => {
            result.data.data.forEach(course=>{
          this.courseList.push(course);
        })
            this.courseList.splice(0,0,{
              id: "",
              name: "--全部课程--",
              orderNo: 0,
              state: 1,
            })
          }).catch((result)=>{
            this.$Message.error("哦豁，操作异常："+result);
          });
        }
    }


</script>
