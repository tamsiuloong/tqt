<template>
    <Card>
        <Row>
            <Col span="24">
              <Input v-model="searchForm.name" placeholder="试卷名字" style="width:200px"/>
              <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
                <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
              </Select>
              <Select v-model="searchForm.courseId" placeholder="课程" style="width:200px">
                <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addExamPaper()">新建</Button>
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
                        <Table :loading="tableLoding" border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center"></Page>
        </Row>
        <br>

        <Modal
                fullscreen=true
                v-model="addModal"
                title="添加试卷"
                :mask-closable="false"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="60%">
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
                <!--一次性取两个元素放在row集合中 -->
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="22">
                              <FormItem label="试卷名字" prop="name">
                                <Input type="text" v-model="addForm.name"/>
                              </FormItem>
                            </Col>
                    </Row>
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="11">
                        <FormItem label="班级" prop="classes.id">
                          <Select filterable="true" placeholder="班级" v-model="addForm.classes.id" style="width:200px">
                            <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                        <Col span="2" style="text-align: center"/>
                        <Col span="11">
                          <FormItem label="课程" >
                            <Select v-model="addForm.course.id" filterable style="width:200px">
                              <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                          </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                      <Col span="11">
                        <FormItem label="试卷类型" prop="paperType">
                          <Select  v-model="addForm.paperType" style="width:200px">
                            <Option v-for="item in paperTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                        <Col span="2"/>
                        <Col span="11">
                          <FormItem label="建议时间"  >
                            <InputNumber :max="1000" :min="1" v-model="addForm.suggestTime"></InputNumber>
                          </FormItem>
                        </Col>
                    </Row>
                    <Row>
                      <Col span="22">
                        <FormItem  :key="index" :label="'标题'+(index+1)+'：'" required v-for="(titleItem,index) in addForm.titleItems">
                          <Input v-model="titleItem.name" style="width: 60%"/>
                          <Button type="primary" icon="ios-add" @click="addQuestion(titleItem)">添加题目</Button>
                          <Button type="error" icon="ios-trash" @click="addForm.titleItems.splice(index,1)">删除</Button>
                          <Card v-if="titleItem.questionItems.length!==0">
                            <FormItem :key="questionIndex" :label="'题目'+(questionIndex+1)+'：'"
                                      v-for="(questionItem,questionIndex) in titleItem.questionItems" style="margin-bottom: 15px">
                              <Row>
                                <Col span="20">
                                  <QuestionShow :qType="questionItem.questionType" :question="questionItem"/>
                                </Col>
                                <Col span="2">
                                  <Button  @click="titleItem.questionItems.splice(questionIndex,1)">删除</Button>
                                </Col>
                              </Row>
                            </FormItem>
                          </Card>
                        </FormItem>
                      </Col>

                    </Row>

                    <Row v-if="addForm.paperType==='4'">
                        <!-- 循环便利row中的两个元素-->
                            <Col span="22">
                            <FormItem label="限制开始时间">
                              <DatePicker type="daterange" @on-change="chooseDate($event,addForm)"  placement="bottom-end" placeholder="选择起始日期" style="width: 200px"></DatePicker>
                            </FormItem>
                            </Col>
                    </Row>

                  <Row >
                    <!-- 循环便利row中的两个元素-->
                    <Col span="22">
                      <Button type="primary" shape="circle" icon="ios-add" @click="addTitle(addForm)">添加标题</Button>
                    </Col>
                  </Row>
            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑试卷"
                :mask-closable="false"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="60%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

              <Row>
                <Col span="22">
                  <FormItem label="试卷名字" prop="name">
                    <Input type="text" v-model="updateForm.name"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="11">
                  <FormItem label="班级" prop="classes.id">
                    <Select filterable="true" placeholder="班级" v-model="updateForm.classes.id" style="width:200px">
                      <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                  <FormItem label="课程" >
                    <Select v-model="updateForm.course.id" filterable style="width:200px">
                      <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="11">
                  <FormItem label="试卷类型" prop="paperType">
                    <Select  v-model="updateForm.paperType" style="width:200px">
                      <Option v-for="item in paperTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="2"/>
                <Col span="11">
                  <FormItem label="建议时间" >
                    <InputNumber :max="1000" :min="1" v-model="updateForm.suggestTime"></InputNumber>
                  </FormItem>
                </Col>

              </Row>

              <Row>
                <Col span="22">
                  <FormItem  :key="index" :label="'标题'+(index+1)+'：'" required v-for="(titleItem,index) in updateForm.titleItems">
                    <Input v-model="titleItem.name" style="width: 60%"/>
                    <Button type="primary" icon="ios-add" @click="addQuestion(titleItem)">添加题目</Button>
                    <Button type="error" icon="ios-trash" @click="updateForm.titleItems.splice(index,1)">删除</Button>
                    <Card v-if="titleItem.questionItems.length!==0">
                      <FormItem :key="questionIndex" :label="'题目'+(questionIndex+1)+'：'"
                                v-for="(questionItem,questionIndex) in titleItem.questionItems" style="margin-bottom: 15px">
                        <Row>
                          <Col span="20">
                            <QuestionShow :qType="questionItem.questionType" :question="questionItem"/>
                          </Col>
                          <Col span="2">
                            <Button  @click="titleItem.questionItems.splice(questionIndex,1)">删除</Button>
                          </Col>
                        </Row>
                      </FormItem>
                    </Card>
                  </FormItem>
                </Col>

              </Row>
              <Row v-if="updateForm.paperType==='4'">
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <FormItem label="限制开始时间">
                    <DatePicker type="daterange" @on-change="chooseDate($event,updateForm)"  placement="bottom-end" placeholder="选择起始日期" style="width: 200px"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
              <Row >
                <!-- 循环便利row中的两个元素-->
                <Col span="22">
                  <Button type="primary" shape="circle" icon="ios-add" @click="addTitle(updateForm)">添加标题</Button>
                </Col>
              </Row>
            </Form>
        </Modal>

      <Modal
        v-model="questionModal"
        title="添加题目"
        :mask-closable=true
        :loading="loading"
        @on-ok="confirmSelectedQuestionList()"
        @on-cancel="questionModal=false"
        ok-text="确认选中题目"
        width="80%">
        <Row>
          <Col span="22">

            <Select v-model="questionForm.courseId" placeholder="课程" style="width:200px">
              <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select :filterable="true" placeholder="题型" @on-change="changeQuestionType($event,questionForm)" v-model="questionForm.questionType" style="width:200px">
              <Option v-for="c in questionTypeList" :value="c.id">{{c.name}}</Option>
            </Select>
            <Input v-model="questionForm.title" placeholder="题目名字" style="width:200px"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="searchQuestion(1)">搜索</Button>
          </Col>
        </Row>
        <br>
        <Row>
          <Table border :columns="columns2" :data="questionPage.content" @on-selection-change="changeQuestion"></Table>
        </Row>
        <br>
        <Row>
          <Page :total="questionPage.totalElements" :page-size="questionPage.size" :current="questionPage.number+1" @on-change="searchQuestion"
                align="center"></Page>
        </Row>

      </Modal>


      <Modal
        v-model="customerAnswerModal"
        title="答卷列表"
        :mask-closable="true"
        :loading="loading"
        :fullscreen=true
        @on-ok="cancel"
        @on-cancel="cancel"
        ok-text="确定"
        width="80%">
        <Row>
          <Table :total="answerPage.total" :columns="columns3" :page-size="answerPage.size" :current="answerPage.pageNum" :data="answerPage.list"></Table>
        </Row>
        <br>
        <Row>
          <Page :total="answerPage.total" :page-size="answerPage.size" :current="answerPage.pageNum" @on-change="searchAnswer"
                align="center"></Page>
        </Row>
      </Modal>
    </Card>
</template>

<script type="text/ecmascript-6">
    // import fetch from '../../utils/fetch';
    // import {dateFormat} from '../../utils/date';
    import axios from '@/libs/api.request'
    import QuestionShow from '../question/components/Show'
    export default {
      components: {  QuestionShow },
        data() {
            return {
                customerAnswerForm:{
                  examPaperId:"",
                  pageIndex:1,
                  pageSize:20
                },
                customerAnswerModal:false,
                questionTotalCount:0,
                questionModal:false,
                currentTitleItem:{},
                questionPage: {
                  pageNum:0,
                  size:20,
                  total:0,
                  list:[]
                },
                columns2: [
                {
                  type: 'selection',
                  width: 60,
                  align: 'center'
                },
                {
                  title: 'id',
                  key: 'id'
                },
                {
                  title: '题干',
                  key: 'title'
                },
                {
                  title: '题型',
                  key: 'questionType',
                  render: (h, params) => {
                    let questionType = "未知";
                    if(params.row.questionType==='1')
                    {
                      questionType="单选";
                    }
                    else if(params.row.questionType==='2')
                    {
                      questionType="多选";
                    }
                    else if(params.row.questionType==='3')
                    {
                      questionType="判断";
                    }
                    else if(params.row.questionType==='4')
                    {
                      questionType="填空";
                    }
                    else if(params.row.questionType==='5')
                    {
                      questionType="简答";
                    }
                    return h('div', [
                      h('strong', questionType)
                    ]);
                  }
                },
                {
                  title: '课程',
                  key: 'courseId',
                  render: (h, params) => {
                    return h('div', [
                      h('strong', params.row.course.name)
                    ]);
                  }
                },
                {
                  title: '分数',
                  key: 'score'
                },
                {
                  title: '难度',
                  key: 'difficult'
                },
                {
                  title: '创建日期',
                  key: 'createTime',
                  render: (h, params) => {
                    let time = "未知";
                    if(params.row.createTime)
                    {
                      time=params.row.createTime.substr(0,10);
                    }
                    return h('div', [
                      h('strong', time)
                    ]);
                  }
                }
              ],
                questionForm:{
                  courseId:"",
                  title:"",
                  questionType:""
                },
                questionTypeList:[
                  {
                    id:"1",
                    name:"单选题"
                  },
                  {
                    id:"2",
                    name:"多选题"
                  },
                  {
                    id:"3",
                    name:"判断题"
                  },
                  // {
                  //   id:"4",
                  //   name:"填空题"
                  // },
                  {
                    id:"5",
                    name:"简答题"
                  }
                ],
                loading:true,
                count: 0,
                gourpId: null,
                tableLoding:true,
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
                      title: 'id',
                      key: 'id'
                    },
                    {
                        title: '试卷名字',
                        key: 'name'
                    },
                    {
                        title: '课程',
                        key: 'courseId',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.course.name)
                          ]);
                        }
                    },
                    {
                      title: '班级',
                      key: 'courseId',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.classes.name+"_"+params.row.classes.type)
                        ]);
                      }
                    },
                    {
                      title: '创建日期',
                      key: 'createTime',
                      render: (h, params) => {
                        let time = "未知";
                        if(params.row.createTime)
                        {
                          time=params.row.createTime.substr(0,10);
                        }
                        return h('div', [
                          h('strong', time)
                        ]);
                      }
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
                              //获取该调查的调查项目list
                              let paperId = params.row.id;
                              this.queryCustomerAnswerList(paperId);


                              this.customerAnswerModal = true;
                            }
                          }
                        }, '答卷管理')
                      ]);
                    }
                  }

                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                  name:"",
                  course:{},
                  classes:{
                    id:""
                  },
                  paperType:"1",
                  gradeLevel:"",
                  score:"",
                  questionCount:"",
                  suggestTime:"",
                  limitStartTime:"",
                  limitEndTime:"",
                  titleItems:[]
                },
                addForm: {
                    name:"",
                    course:{},
                    classes:{
                      id:""
                    },
                    paperType:"1",
                    gradeLevel:"",
                    score:"",
                    questionCount:"",
                    suggestTime:"",
                    limitStartTime:"",
                    limitEndTime:"",
                    titleItems:[]
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    name: [
                        {required: true, message:'试卷名字不能为空',trigger:'blur'}
                    ]
                    ,
                    courseId: [
                        {required: true, message:'课程不能为空',trigger:'blur'}
                    ]
                    ,
                    paperType: [
                        {required: true, message:'试卷类型不能为空',trigger:'blur'}
                    ]
                    ,
                    gradeLevel: [
                        {required: true, message:'阶段不能为空',trigger:'blur'}
                    ]
                    ,
                    score: [
                        {required: true, message:'得分不能为空',trigger:'blur'}
                    ]
                    ,
                    questionCount: [
                        {required: true, message:'题数不能为空',trigger:'blur'}
                    ]
                    ,
                    suggestTime: [
                        {required: true, message:'建议时间不能为空',trigger:'blur'}
                    ]
                    ,
                    limitStartTime: [
                        {required: true, message:'限制开始时间不能为空',trigger:'blur'}
                    ]
                    ,
                    limitEndTime: [
                        {required: true, message:'限制结束时间不能为空',trigger:'blur'}
                    ]
                    ,
                    userId: [
                        {required: true, message:'创建用户不能为空',trigger:'blur'}
                    ]
                    ,
                    createTime: [
                        {required: true, message:'创建日期不能为空',trigger:'blur'}
                    ]
                    ,
                    deleted: [
                        {required: true, message:'是否删除不能为空',trigger:'blur'}
                    ]
                    ,
                    taskExamId: [
                        {required: true, message:'任务不能为空',trigger:'blur'}
                    ],
                    "classes.id": [
                      {required: true, message:'班级不能为空',trigger:'blur'}
                    ]
                },
                courseList:[
                {
                  id:"",
                  name:"--所有--"
                }],
                paperTypeList:[
                  {
                    id:"1",
                    name:"固定试卷"
                  }
                  // ,
                  // {
                  //   id:"4",
                  //   name:"时段试卷"
                  // },
                  // {
                  //   id:"6",
                  //   name:"任务试卷"
                  // }
                ],
                classesList:[
                  {
                    id:"",
                    name:"--所有--"
                  }
                ],
                searchForm:{
                  classId:"",
                  name:"",
                  courseId:"",
                },
                selectedQuestionList:[],
                answerPage: {
                  number:0,
                  size:20,
                  totalElements:0,
                  content:[]
                },
                columns3: [
                {
                  title: '名字',
                  key: 'userName'
                },



                {
                  title: '题数',
                  key: 'questionCount'
                },
                {
                  title: '正确题数',
                  key: 'questionCorrect'
                },
                {
                  title: '试卷总分',
                  key: 'paperScore'
                },
                {
                  title: '系统评分',
                  key: 'systemScore'
                },
                {
                  title: '最终分数',
                  key: 'userScore'
                },
                {
                  title: '用时',
                  key: 'doTime'
                },
                {
                  title: '状态',
                  key: 'status',
                  render: (h, params) => {
                    let result = "未知";
                    if(params.row.status===2)
                    {
                      result="完成";
                    }
                    else if(params.row.status===1)
                    {
                      result="待批改";
                    }
                    return h('div', [
                      h('strong', result)
                    ]);
                  }
                },
                {
                  title: '创建日期',
                  key: 'createTime',
                  render: (h, params) => {
                    let time = "未知";
                    if(params.row.createTime)
                    {
                      time=params.row.createTime.substr(0,10);
                    }
                    return h('div', [
                      h('strong', time)
                    ]);
                  }
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
                              let id = params.row.id;
                              if(params.row.status==2)
                              {
                                window.open('http://localhost:1024/#/read?id=' + id+"&cl=1")
                              }
                              else if(params.row.status==1)
                              {
                                window.open(' http://localhost:1024/#/edit?id=' + id+"&cl=1")
                              }
                            }
                          }
                        }, params.row.status==1?"批改试卷":"查看试卷")
                      ]);
                    }
                  }
              ],
            }
        },
        methods: {
          searchAnswer(pageNo){
            axios.request({
              url: '/api/examPaperAnswer/pageList',
              method: 'post',
              data:this.customerAnswerForm
            }).then((result) => {
              this.answerPage = result.data.response;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });
          },
          queryCustomerAnswerList(id){
              this.customerAnswerForm.examPaperId = id;
              this.searchAnswer(1);
            },
            addTitle (form) {
              form.titleItems.push({
                name: '',
                questionItems: []
              })
            },

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
            addExamPaper(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                      if(!this.addForm.suggestTime){
                        this.$Message.error("建议时间不能为空");
                        this.resetLoading();
                        return;
                      }
                      if(!this.addForm.titleItems||this.addForm.titleItems.length==0){
                        this.$Message.error("试卷题目不能为空");
                        this.resetLoading();
                        return;
                      }
                        const examPaper = this.addForm;
                        axios.request({
                            url: '/api/examPaper',
                            method: 'post',
                            data: examPaper
                        }).then((result) => {
                            this.gopage(this.pageNo);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('Success!');
                            this.addModal = false;
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
            edit () {
                if (this.count != 1) {
                    this.updateModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
                    this.updateModal = true;
                    axios.request({
                        url: '/api/examPaper/select/'+this.updateForm.id,
                        method: 'post'
                    }).then((result) => {
                        this.updateForm = result.data.data;
                    }).catch((result)=>{
                        this.$Message.error("操作异常："+result);
                    });
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                      if(!this.updateForm.suggestTime){
                        this.$Message.error("建议时间不能为空");
                        this.resetLoading();
                        return;
                      }
                      if(!this.updateForm.titleItems||this.updateForm.titleItems.length==0){
                        this.$Message.error("试卷题目不能为空");
                        this.resetLoading();
                        return;
                      }
                        axios.request({
                            url: '/api/examPaper',
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
                        url: '/api/examPaper',
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
                this.tableLoding=true;
                const pageSize = this.pageSize;
                axios.request({
                    url: '/api/examPaper/page',
                    method: 'post',
                    params: {pageNo, pageSize},
                    data:this.searchForm
                }).then((result) => {
                    this.page = result.data.data;
                    this.tableLoding=false;
                }).catch((result)=>{
                    this.$Message.error("操作异常："+result);
                });
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            chooseDate(e1,form){
              form.limitStartTime = e1[0];
              form.limitEndTime = e1[1];
            },
            addQuestion (titleItem) {
              this.currentTitleItem = titleItem
              this.questionModal = true
              this.searchQuestion(1)
            },
            searchQuestion(pageNo){
              const pageSize = this.questionPage.size;
              axios.request({
                url: '/api/question/page',
                method: 'post',
                params: {pageNo, pageSize},
                data:this.questionForm
              }).then((result) => {
                this.questionPage = result.data.data;
              }).catch((result)=>{
                this.$Message.error("操作异常："+result);
              });
            },
            changeQuestion(e){
              this.selectedQuestionList = e;
            },
            confirmSelectedQuestionList(){
              this.selectedQuestionList.forEach(item=>this.currentTitleItem.questionItems.push(item));
              this.questionModal = false;
            },
            resetLoading(){
              setTimeout(()=>{
                this.loading=false;
                this.$nextTick(()=>{
                  this.loading=true;
                });
              },1000);
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
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });
            axios.request({
              url: '/api/classes/all',
              method: 'get'
            }).then((result) => {
              result.data.data.forEach(classes=>{
                this.classesList.push(classes);
              })
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });
        }
    }


</script>
