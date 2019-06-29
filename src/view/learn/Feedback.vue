<template>
    <Card>
        <Row>
            <Col span="8">
                学习反馈：<Input v-model="keyWord" placeholder="请输入..." style="width:200px"/>
            </Col>
            <Col span="8"><Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button></Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addFeedback()">新建</Button>
                    <Button type="success" icon="ios-build" @click="edit()">修改</Button>
                    <Button type="error" icon="ios-trash" @click="remove()">删除</Button>
        </Row>
        <br>
        <Row>
                        <Table border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center"></Page>
        </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加学习反馈"
                :mask-closable="false"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="80%"
                height="90%"
        >
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                      <Col span="10">
                        <FormItem label="课程" prop="course.id">
                          <Select v-model="addForm.course.id" style="width:200px">
                            <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="6">
                        <FormItem label="课程第几天" >
                          <InputNumber :max="20" :min="1"  v-model="addForm.dayNum"/>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="6">
                        <FormItem label="吸收情况" prop="absorption">
                          <!--<Input  :max="100" :min="0"  v-model="addForm.absorption"/>-->
                          <!--<InputNumber-->
                            <!--:max="100"-->
                            <!--v-model="addForm.absorption"-->
                            <!--:formatter="value => `${value}%`"-->
                            <!--:parser="value => value.replace('%', '')"></InputNumber>-->
                          <Select v-model="addForm.absorption" style="width:200px">
                            <Option  value="0-30">0-30</Option>
                            <Option  value="30-50">30-50</Option>
                            <Option  value="50-70">50-70</Option>
                            <Option  value="70-90">70-90</Option>
                            <Option  value="90以上">90以上</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="22">
                        <FormItem label="不清楚的地方" prop="notClear">
                          <Input type="textarea" v-model="addForm.notClear"/>
                        </FormItem>
                      </Col>

                    </Row>
              <Row>
                <Col span="22">
                  <FormItem label="明日目标" prop="plan">
                    <Input type="textarea" v-model="addForm.plan"/>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                  <FormItem label="实施方案" prop="todo">
                    <Input type="textarea" v-model="addForm.todo"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="自我觉察" >
                    <Input type="textarea" v-model="addForm.selfCheck"/>
                  </FormItem>
                </Col>
              </Row>

                    <Row>
                        <Col span="22">
                          <FormItem label="调整方案" >
                            <Input type="textarea" v-model="addForm.adjustment"/>
                          </FormItem>
                        </Col>

                    </Row>

            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑学习反馈"
                :mask-closable="false"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="90%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="10">
                  <FormItem label="课程" prop="course.id">
                    <Select v-model="updateForm.course.id" style="width:200px">
                      <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="6">
                  <FormItem label="课程第几天" >
                    <InputNumber :max="20" :min="1"  v-model="updateForm.dayNum"/>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="6">
                  <FormItem label="吸收情况" prop="absorption">
                    <!--<Input  :max="100" :min="0"  v-model="updateForm.absorption"/>-->
                    <!--<InputNumber-->
                      <!--:max="100"-->
                      <!--v-model="updateForm.absorption"-->
                      <!--:formatter="value => `${value}%`"-->
                      <!--:parser="value => value.replace('%', '')"></InputNumber>-->
                    <Select v-model="updateForm.absorption" >
                      <Option  value="0-30">0-30</Option>
                      <Option  value="30-50">30-50</Option>
                      <Option  value="50-70">50-70</Option>
                      <Option  value="70-90">70-90</Option>
                      <Option  value="90以上">90以上</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <FormItem label="不清楚的地方" prop="notClear">
                    <Input type="textarea" v-model="updateForm.notClear"/>
                  </FormItem>
                </Col>

              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="明日目标" prop="plan">
                    <Input type="textarea" readonly v-model="updateForm.plan"/>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                  <FormItem label="实施方案" prop="todo">
                    <Input type="textarea" readonly v-model="updateForm.todo"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="自我觉察" prop="selfCheck">
                    <Input type="textarea" v-model="updateForm.selfCheck"/>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                  <FormItem label="调整方案" prop="adjustment">
                    <Input type="textarea" v-model="updateForm.adjustment"/>
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
                  title: '学员',
                  key: 'stuName'
                },
                {
                  title: '课程',
                  width: 100,
                  key: 'courseId',
                  render: (h, params) => {
                    return h('div', [
                      h('strong', params.row.course.name)
                    ]);
                  }
                },
                {
                  title: '第几天',
                  key: 'dayNum'
                },{
                  title: '吸收情况',
                  key: 'absorption',
                  sortable: true
                },
                // {
                //     title: '不清楚的地方',
                //     key: 'notClear',
                //     render: (h, params) => {
                //       return h('div', [
                //         h('strong',params.row.notClear.length>10? params.row.notClear.substring(0,10):params.row.notClear)
                //       ]);
                //     }
                // },
                // {
                //     title: '明日目标',
                //     key: 'plan',
                //   render: (h, params) => {
                //     return h('div', [
                //       h('strong',params.row.plan.length>10? params.row.plan.substring(0,10):params.row.plan)
                //     ]);
                //   }
                // },
                // {
                //   title: '实施方案',
                //   key: 'todo',
                //   render: (h, params) => {
                //     return h('div', [
                //       h('strong',params.row.todo.length>10? params.row.todo.substring(0,10):params.row.todo)
                //     ]);
                //   }
                // },
                // {
                //     title: '自我觉察',
                //     key: 'selfCheck',
                //     render: (h, params) => {
                //       return h('div', [
                //         h('strong',params.row.selfCheck.length>10? params.row.selfCheck.substring(0,10):params.row.selfCheck)
                //       ]);
                //     }
                // },
                // {
                //   title: '调整方案',
                //   key: 'adjustment',
                //   render: (h, params) => {
                //     return h('div', [
                //       h('strong',params.row.adjustment.length>10? params.row.adjustment.substring(0,10):params.row.adjustment)
                //     ]);
                //   }
                // },
                {
                  title: '时间',
                  key: 'backTime',
                  width: 160
                },
                {
                  title: '操作',
                  key: 'action',
                  fixed: 'right',
                  width: 120,
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'text',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.updateForm = params.row;
                            this.updateModal = true;
                          }
                        }
                      }, '详情')
                    ]);
                  }
                }

              ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        adjustment:"",
                        dayNum:1,
                        notClear:"",
                        plan:"",
                        selfCheck:"",
                        absorption:null,
                        todo:"",
                        course:{
                          id:null,
                          name:''
                        }
                },
                addForm: {
                        adjustment:"",
                        dayNum:1,
                        notClear:"",
                        plan:"",
                        selfCheck:"",
                        absorption:null,
                        todo:"",
                        course:{
                          id:"1",
                          name:null
                        }
                },
                formRule: {
                    adjustment: [
                        {required: true, message:'强迫自己跳出舒适区，先自己画图梳理出代码思路，然后再打代码',trigger:'blur'}
                    ],
                    "absorption":[
                      {required: true, message:'吸收情况是必须要让老师知道滴',trigger:'blur'}
                    ],
                    'dayNum': [
                      {required: true, message:'课程天数不能为空',trigger:'blur'}
                    ]
                    ,
                    notClear: [
                        {required: true, message:'当日知识点还有哪些不清楚的？',trigger:'blur'}
                    ]
                    ,
                    plan: [
                        {required: true, message:'小目标是必须滴，是你通过努力一定可以做到的哟，比如学懂什么是hibernate，hibernate的核心api怎么用等',trigger:'blur'}
                    ]
                    ,
                    selfCheck: [
                        {required: true, message:'你该不会以为自己完美了吧！比如：经过今天的执行，感觉自己太喜欢停留在舒适区，不太主动思考，全是照着打代码。',trigger:'blur'}
                    ]
                    ,
                    todo: [
                        {required: true, message:'针对于目标，你打算采取什么样的措施来帮助你达到目标？比如，1，提前预习，带着问题去听课。2，如果课程听明白了，不看视频，直接看讲义做练习。',trigger:'blur'}
                    ]
                    ,
                    'course.id': [
                        {required: true, message:'课程都不选，你想干嘛',trigger:'blur'}
                    ]

                },
                courseList:[]
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
            addFeedback(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const feedback = this.addForm;
                        axios.request({
                            url: '/api/feedback',
                            method: 'post',
                            data: feedback
                        }).then((result) => {
                            this.gopage(this.pageNo);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('Success!');
                            this.addModal = false;
                        }).catch((result)=>{
                          this.$Message.error("添加失败："+result);
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
                            url: '/api/feedback',
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
                        url: '/api/feedback',
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
            gopage(){
                const pageNo = this.pageNo;
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/feedback',
                    method: 'get',
                    params: {pageNo, pageSize,keyWord}
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
        created: function () {
            this.gopage();

            //courseList
            axios.request({
              url: '/api/course/all',
              method: 'get'
            }).then((result) => {
              this.courseList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("操作异常："+result);
            });
        }
    }


</script>
