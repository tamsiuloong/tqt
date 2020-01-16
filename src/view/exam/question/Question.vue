<template>
    <Card>
        <Row>
            <Col span="22">

              <Select v-model="searchForm.courseId" placeholder="课程" style="width:200px">
                <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
              <Select :filterable="true" placeholder="题型" @on-change="changeQuestionType($event,searchForm)" v-model="searchForm.questionType" style="width:200px">
                <Option v-for="c in questionTypeList" :value="c.id">{{c.name}}</Option>
              </Select>
              <Input v-model="searchForm.title" placeholder="题目名字" style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addQuestion()">新建</Button>
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
                              align="center"></Page>
        </Row>
        <br>

        <Modal
                v-model="richEditor.dialogVisible"
                title="编辑"
                :mask-closable="false"
                :loading="loading"
                @on-ok="editorConfirm"
                @on-cancel="richEditor.dialogVisible = false"

                width="90%">
              <quill-editor v-model="richEditor.instance"
                            ref="myQuillEditor"
                            :options="editorOption"
              >
              </quill-editor>
        </Modal>
      <Modal
        v-model="addModal"
        title="添加试卷试题"
        :mask-closable="false"
        :loading="loading"
        @on-ok="add"
        @on-cancel="cancel"
        fullscreen="true"
        width="90%">
        <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
          <!--一次性取两个元素放在row集合中 -->
          <Row>
            <!-- 循环便利row中的两个元素-->
            <Col span="11">
              <FormItem label="题型" prop="questionType">
                <Select :filterable="true" placeholder="题型" @on-change="changeQuestionType($event,addForm)" v-model="addForm.questionType" style="width:200px">
                  <Option v-for="c in questionTypeList" :value="c.id">{{c.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
            <Col span="11">
              <FormItem label="课程" prop="course.id">
                <Select v-model="addForm.course.id" filterable style="width:200px">
                  <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <!-- 循环便利row中的两个元素-->
            <Col span="11">
              <FormItem label="难度">
                <Rate v-model="addForm.difficult" />
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
            <Col span="11">
              <FormItem label="分数">
                <InputNumber :max="1000" :min="1" v-model="addForm.score"></InputNumber>
              </FormItem>

            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="题干">
                <Input v-model="addForm.title"  @on-focus="inputClick(addForm,'title')" />
              </FormItem>
            </Col>
          </Row>
          <Row v-if="addForm.questionType==='1' || addForm.questionType==='2' || addForm.questionType==='3'">
            <Col span="22">
              <FormItem label="选项">
                <FormItem v-for="(item,index) in addForm.items" :key="item.prefix" :label="item.prefix" >
                  <Input v-model="item.prefix"  style="width: 50px" />
                  <Input v-model="item.content"  style="width: 60%" @on-focus="inputClick(item,'content')"/>
                  <Button v-if="addForm.questionType==='1' || addForm.questionType==='2'" type="error" icon="ios-trash" @click="questionItemRemove(index,addForm)">删除</Button>
                </FormItem>
                <Button type="success" v-if="addForm.questionType==='1' || addForm.questionType==='2'" icon="ios-add" @click="questionItemAdd(addForm)">添加选项</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="解析">
                <Input v-model="addForm.analyze"  @on-focus="inputClick(addForm,'analyze')"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>

          </Row>
          <Row>
            <Col span="22">
              <FormItem label="正确答案">
                <RadioGroup v-model="addForm.correct" v-if="addForm.questionType==='1'||addForm.questionType==='3'">
                  <Radio v-for="i in addForm.items" :label="i.prefix"></Radio>
                </RadioGroup>
                <CheckboxGroup v-model="addForm.correctArray" v-else-if="addForm.questionType==='2'">
                  <Checkbox v-for="i in addForm.items" :label="i.prefix"></Checkbox>
                </CheckboxGroup>
                <Input v-model="addForm.correct" type="textarea" v-else-if="addForm.questionType==='5'"  />
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>

          </Row>

        </Form>
      </Modal>

        <Modal
                v-model="updateModal"
                title="编辑试卷试题"
                :mask-closable="false"
                :loading="loading"
                fullscreen="true"
                @on-ok="update"
                @on-cancel="cancel"
                width="60%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="11">
                  <FormItem label="题型" prop="questionType">
                    <Select :filterable="true" disabled="true" placeholder="题型" @on-change="changeQuestionType($event,updateForm)" v-model="updateForm.questionType" style="width:200px">
                      <Option v-for="c in questionTypeList" :value="c.id">{{c.name}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                  <FormItem label="课程" prop="course.id">
                    <Select v-model="updateForm.course.id" filterable style="width:200px">
                      <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <!-- 循环便利row中的两个元素-->
                <Col span="11">
                  <FormItem label="难度">
                    <Rate v-model="updateForm.difficult" />
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>
                <Col span="11">
                  <FormItem label="分数">
                    <InputNumber :max="1000" :min="1" v-model="updateForm.score"></InputNumber>
                  </FormItem>

                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="题干">
                    <Input v-model="updateForm.title"  @on-focus="inputClick(updateForm,'title')"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="选项" v-if="updateForm.questionType==='1' || updateForm.questionType==='2' || updateForm.questionType==='3'">
                    <FormItem v-for="(item,index) in updateForm.items" :key="item.prefix" :label="item.prefix" >
                      <Input v-model="item.prefix"  style="width: 50px" />
                      <Input v-model="item.content"  style="width: 60%" @on-focus="inputClick(item,'content')"/>
                      <Button type="error" v-if="updateForm.questionType==='1' || updateForm.questionType==='2'" icon="ios-trash" @click="questionItemRemove(index,updateForm)">删除</Button>
                    </FormItem>
                    <Button type="success" v-if="updateForm.questionType==='1' || updateForm.questionType==='2'" icon="ios-add" @click="questionItemAdd(updateForm)">添加选项</Button>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="解析">
                    <Input v-model="updateForm.analyze"  @on-focus="inputClick(updateForm,'analyze')"/>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>

              </Row>
              <Row>
                <Col span="22">
                  <FormItem label="正确答案">
                    <RadioGroup v-model="updateForm.correct" v-if="updateForm.questionType==='1'||updateForm.questionType==='3'">
                      <Radio v-for="i in updateForm.items" :label="i.prefix"></Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="updateForm.correctArray" v-else-if="updateForm.questionType==='2'">
                      <Checkbox v-for="i in updateForm.items" :label="i.prefix"></Checkbox>
                    </CheckboxGroup>
                    <Input v-model="updateForm.correct" type="textarea" v-else-if="updateForm.questionType==='5'"  />
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center"/>

              </Row>

            </Form>
        </Modal>
    </Card>
</template>

<script type="text/ecmascript-6">
    import axios from '@/libs/api.request'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import { quillEditor } from 'vue-quill-editor'
    export default {
        components: {
          quillEditor
        },
        data() {
            return {
                editorOption: {
                  modules: {
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      [{ 'header': 1 }, { 'header': 2 }],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      [{ 'script': 'sub' }, { 'script': 'super' }],
                      [{ 'indent': '-1' }, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      [{ 'font': [] }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['clean'],
                      ['link', 'image', 'video']
                    ]
                  },
                  readOnly: true,
                  theme: 'snow'
                },
                tableLoding:true,
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
                      title: 'id',
                      key: 'id'
                    },
                    {
                      title: '题干',
                      key: 'shortTitle',
                      render: (h, params) => {
                        let result = "未知";
                        if(params.row.createTime)
                        {
                          result=params.row.shortTitle.substr(0,20);
                        }
                        return h('div', [
                          h('strong', result)
                        ]);
                      }
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
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                  questionType:"1",
                  course:{},
                  score:"",
                  difficult:"",
                  correct:"",
                  correctArray:[],
                  userId:"",
                  status:"",
                  deleted:"",
                  items:[{
                    prefix:"A",
                    content:""
                  },{
                    prefix:"B",
                    content:""
                  },{
                    prefix:"C",
                    content:""
                  },{
                    prefix:"D",
                    content:""
                  }],
                  analyze:""
                },
                addForm: {
                        questionType:"1",
                        course:{},
                        score:"",
                        difficult:"",
                        correct:"",
                        correctArray:[],
                        userId:"",
                        status:"",
                        deleted:"",
                        items:[{
                          prefix:"A",
                          content:""
                        },{
                          prefix:"B",
                          content:""
                        },{
                          prefix:"C",
                          content:""
                        },{
                          prefix:"D",
                          content:""
                        }],
                        analyze:""
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    questionType: [
                        {required: true, message:'问题类型不能为空',trigger:'blur'}
                    ]
                    ,
                    'course.id': [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    score: [
                        {required: true, message:'分数不能为空',trigger:'blur'}
                    ]
                    ,
                    difficult: [
                        {required: true, message:'难度不能为空',trigger:'blur'}
                    ]
                    ,
                    correct: [
                        {required: true, message:'正确答案不能为空',trigger:'blur'}
                    ]
                    ,
                    userId: [
                        {required: true, message:'创建用户不能为空',trigger:'blur'}
                    ]
                    ,
                    status: [
                        {required: true, message:'状态不能为空',trigger:'blur'}
                    ]
                    ,
                    createTime: [
                        {required: true, message:'创建日期不能为空',trigger:'blur'}
                    ]
                    ,
                    deleted: [
                        {required: true, message:'删除不能为空',trigger:'blur'}
                    ]
                },
                classesList:[
                  {
                    id:"",
                    name:"--所有--"
                  }
                ],
                courseList:[
                {
                  id:"",
                  name:"--所有--"
                }],
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
                searchForm:{
                  courseId:"",
                  title:"",
                  questionType:""
                },
                richEditor: {
                  dialogVisible: false,
                  object: null,
                  parameterName: '',
                  instance: ""
                }
            }
        },
        methods: {
            inputClick (object, parameterName) {
              this.richEditor.instance = object[parameterName];
              this.richEditor.object = object
              this.richEditor.parameterName = parameterName
              this.richEditor.dialogVisible = true
            },
            editorConfirm () {
              let content = this.richEditor.instance
              this.richEditor.object[this.richEditor.parameterName] = content
              this.richEditor.dialogVisible = false
            },
            changeQuestionType(e,form){
              // if(form.items)
              // {
                if(e==='1'||e==='2')
                {
                  form.items=[{
                    prefix:"A",
                    content:""
                  },{
                    prefix:"B",
                    content:""
                  },{
                    prefix:"C",
                    content:""
                  },{
                    prefix:"D",
                    content:""
                  }];
                }
                else if(e==='3')
                {
                  form.items=[{
                    prefix:"A",
                    content:"对"
                  },{
                    prefix:"B",
                    content:"错"
                  }];
                }
                else if(e==='5')
                {
                  form.items=null;
                }
              // }
            },
            questionItemRemove (index,form) {
              form.items.splice(index, 1)
            },
            questionItemAdd (form) {
              let items = form.items
              let last = items[items.length - 1]
              let newLastPrefix = String.fromCharCode(last.prefix.charCodeAt() + 1)
              items.push({ id: null, prefix: newLastPrefix, content: '' })

            },
            change(e){
                this.count = e.length;
                if (e.length == 1) {
                    if(e[0].questionItems.content)
                    {
                      e[0].items = JSON.parse(e[0].questionItems.content);
                    }
                    //如果是多选
                    if(e[0].questionType==="2")
                    {
                      e[0].correctArray = e[0].correct.split(",");
                    }
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
            addQuestion(){

                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const question = this.addForm;
                        axios.request({
                            url: '/api/question',
                            method: 'post',
                            data: question
                        }).then((result) => {
                            this.gopage(this.pageNo);
                            this.$refs['addForm'].resetFields();
                            this.$Message.success('Success!');
                            this.addModal = false;
                            //清空表单
                            this.addForm =  {
                            questionType:"1",
                            course:{},
                            score:"",
                            difficult:"",
                            correct:"",
                            correctArray:[],
                            userId:"",
                            status:"",
                            deleted:"",
                            items:[{
                              prefix:"A",
                              content:""
                            },{
                              prefix:"B",
                              content:""
                            },{
                              prefix:"C",
                              content:""
                            },{
                              prefix:"D",
                              content:""
                            }],
                            analyze:""
                          };
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
                            url: '/api/question',
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
                        url: '/api/question',
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
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/question/page',
                    method: 'post',
                    params: {pageNo, pageSize,keyWord},
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
            }
        },
        mounted: function () {
            this.gopage(1);
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
