<template>
    <Card>
        <Row>
            <Col span="24">
              <Select v-model="searchForm.courseId" style="width:200px" filterable @on-change="queryKnowledgePoint">
                <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
                <Select v-model="searchForm.knowledgePointId" style="width:200px" filterable >
                  <Option v-for="item in knowledgePointList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="searchForm.title" placeholder="请输入面试题题目..." style="width:200px"/>

                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addInterviewQuestion()">新建面试题</Button>
                    <Button type="primary" icon="ios-add" @click="batchInterviewQuestions()">批量导入面试题</Button>
                    <Button type="success" icon="ios-build" @click="edit()">修改面试题</Button>
                    <Button type="error" icon="ios-trash" @click="remove()">删除面试题</Button>
        </Row>
        <br>
        <Row>
                  <Table  ref="table" :loading="tableLoding" border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
          <br>
          <Button type="primary" size="large" @click="exportData()"><Icon type="ios-download-outline"></Icon>导出面试题</Button>

        </Row>
        <br>
        <Row>
                        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage" @on-page-size-change="changePS"
                              align="center" show-total show-sizer :page-size-opts="pageSizeOpts"></Page>
             </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加面试题"
                :mask-closable="true"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="80%">
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">
                <!--一次性取两个元素放在row集合中 -->
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="课程" >
                                <Select v-model="addForm.course.id" style="width:200px"  @on-change="queryKnowledgePoint" filterable>
                                  <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="知识点" >
                              <Select v-model="addForm.knowledgePoint.id" style="width:200px" filterable>
                                <Option v-for="item in knowledgePointList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                      </Row>
                      <Row>
                          <!-- 循环便利row中的两个元素-->
                        <Col span="20">
                          <FormItem label="题目" prop="title">
                            <Input type="text" v-model="addForm.title"/>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="20">
                          <FormItem label="答案" prop="answer">
                            <!--<markdown-editor v-model="addForm.answer"/>-->
                            <!--<Input type="text" v-model="addForm.answer"/>-->
                            <quill-editor v-model="addForm.answer"
                                          ref="myQuillEditor"
                                          :options="editorOption"
                            >
                            </quill-editor>
                          </FormItem>
                        </Col>
                      </Row>


            </Form>
        </Modal>
        <Modal
        v-model="batchModal"
        title="批量导入面试题"
        :mask-closable="true"
        :loading="loading"
        @on-ok="batchImport"
        @on-cancel="cancel"
        width="95%">
        <Form ref="batchForm" :model="batchForm" :rules="batchFormRule"  :label-width="80">
          <!--一次性取两个元素放在row集合中 -->
          <Row>
            <!-- 循环便利row中的两个元素-->
            <Col span="22">
              <FormItem label="公司名字" prop="company">
                  <Input type="text" v-model="batchForm.company"/>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="22">
              <FormItem label="word文本" prop="text">
                <quill-editor v-model="batchForm.text"
                              ref="myQuillEditor"
                              :options="editorOption"
                >
                </quill-editor>
                <br>
                <Button type="success" icon="ios-build" @click="wordToTable()">word转table</Button>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="22">
              <FormItem label="数据">
                <Table border :columns="batchImportColumns" :data="batchImportData">
                  <template slot-scope="{ row, index }" slot="course">

                     <Select v-model="batchImportData[index].course.id" style="width:200px" filterable  @on-change="queryKnowledgePointForBatch(batchImportData[index].course.id,index)">
                       <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                     </Select>

                  </template>
                  <template slot-scope="{ row, index }" slot="knowledgePoint">

                    <Select v-model="batchImportData[index].knowledgePoint.id" filterable style="width:200px">
                      <Option v-for="item in knowledgePointLists[index]" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>

                  </template>
                </Table>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>

        <Modal
                v-model="updateModal"
                title="编辑面试题"
                :mask-closable="true"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="80%">
          <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">
            <!--一次性取两个元素放在row集合中 -->
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="11">
                <FormItem label="课程" >
                  <Select v-model="updateForm.course.id" style="width:200px" filterable @on-change="queryKnowledgePoint">
                    <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="知识点" >
                  <Select v-model="updateForm.knowledgePoint.id" style="width:200px" filterable >
                    <Option v-for="item in knowledgePointList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="20">
                <FormItem label="题目" prop="title">
                  <Input type="text" v-model="updateForm.title"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="20">
                <FormItem label="答案" prop="answer">
                  <!--<markdown-editor v-model="updateForm.answer"/>-->

                  <quill-editor v-model="updateForm.answer"
                                ref="myQuillEditor"
                                :options="editorOption"
                  >
                  </quill-editor>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>


        <Modal
        v-model="detailModal"
        title="查看面试题"
        @on-cancel="cancel"
        width="80%">
        <Form ref="detail" :model="detail" :rules="formRule" :label-width="80">
          <!--一次性取两个元素放在row集合中 -->
          <Row>
            <!-- 循环便利row中的两个元素-->
            <Col span="11">
              <FormItem label="课程" >
                <Input v-model="detail.course.name" readonly="true" style="width: 200px" />
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
            <Col span="11">
              <FormItem label="知识点" >
                <Input v-model="detail.knowledgePoint.name" readonly="true" style="width: 200px" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <!-- 循环便利row中的两个元素-->
            <Col span="20">
              <FormItem label="题目" prop="title">
                <Input type="text" readonly="true" v-model="detail.title"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="答案" prop="answer">
                <!--<mavon-editor v-model="detail.answer" :toolbars="markdownOption" :editable="false" :defaultOpen="edit" :toolbarsFlag="true"/>-->
                <quill-editor v-model="detail.answer"
                              ref="myQuillEditor"
                              :options="editorOptionForShow"
                             >
                </quill-editor>
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
    import {getParams} from '@/libs/util'
    import MarkdownEditor from '_c/markdown'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import { quillEditor } from 'vue-quill-editor'


    export default {
        components: {
          MarkdownEditor,
          quillEditor
        },
        data() {
            return {
              pageSizeOpts:[10, 20, 30, 50,100],
              batchImportColumns: [
                {
                  title: '题目',
                  key: 'title'
                },
                {
                  title: '答案',
                  key: 'answer'
                },
                {
                  title: '课程',
                  slot: 'course',
                  key: 'courseId',
                  slot: 'course',
                  // render: (h, params) => {
                  // //   //   <Select v-model="model1" style="width:200px">
                  // //   //   <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  // //   // </Select>
                  //   let options = [];
                  //   this.courseList.forEach(course=>{
                  //     options.push(
                  //       h('Option',{
                  //         props: {
                  //           value: course.id,
                  //           key:course.id
                  //         }
                  //       },course.name)
                  //     );
                  //   })
                  //
                  //   return h('Select', {
                  //       props:{
                  //         "v-model": params.row.course.name,
                  //       },
                  //       on: {
                  //         'on-change':(event) => {}
                  //       },
                  //     },
                  //     options
                  //   );
                  // }

                },
                {
                  title: '知识点',
                  slot: 'knowledgePoint',
                  key: 'knowledgePointId'
                }
              ],
              batchImportData: [

              ],
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
              editorOptionForShow: {
                modules: {
                  toolbar: [
                    ['clean']
                  ]
                },
                readOnly: true,
                theme: 'snow'
              },
                markdownOption: {
                  // bold: true, // 粗体
                  // italic: true, // 斜体
                  // header: true, // 标题
                  // underline: true, // 下划线
                  // strikethrough: true, // 中划线
                  // mark: true, // 标记
                  // superscript: true, // 上角标
                  // subscript: true, // 下角标
                  // quote: true, // 引用
                  // ol: true, // 有序列表
                  // ul: true, // 无序列表
                  // link: true, // 链接
                  // imagelink: true, // 图片链接
                  // code: true, // code
                  // table: true, // 表格
                  fullscreen: true, // 全屏编辑
                  readmodel: true, // 沉浸式阅读
                  // htmlcode: true, // 展示html源码
                  // help: true, // 帮助
                  // /* 1.3.5 */
                  // undo: true, // 上一步
                  // redo: true, // 下一步
                  // trash: true, // 清空
                  // save: true, // 保存（触发events中的save事件）
                  // /* 1.4.2 */
                  // navigation: true, // 导航目录
                  // /* 2.1.8 */
                  // alignleft: true, // 左对齐
                  // aligncenter: true, // 居中
                  // alignright: true, // 右对齐
                  // /* 2.2.1 */
                  // subfield: true, // 单双栏模式
                  preview: true, // 预览
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
                        title: '题目',
                        width: 260,
                        key: 'title'
                    },
                    {
                      title: '答案',
                      width: 260,
                      key: 'answer'
                    },
                    {
                        title: '课程',
                        key: 'courseName',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.course.name)
                          ]);
                        }
                    },
                    {
                        title: '知识点',
                        key: 'knowledgePointName',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.knowledgePoint.name)
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
                                if(!params.row.course)
                                {
                                  params.row.course = {}
                                }
                                if(!params.row.knowledgePoint)
                                {
                                  params.row.knowledgePoint = {}
                                }
                                this.detail = params.row;
                                this.detailModal = true;
                              }
                            }
                          }, '查看')
                        ]);
                      }
                    }
                ],
                self: this,
                page: {
                  size : 20
                },
                updateModal: false,
                addModal: false,
                updateForm: {
                        title:"",
                        course:{
                          id:""
                        },
                        knowledgePoint:{
                          id:""
                        },
                        answer:""
                },
                addForm: {
                        title:"",
                        course:{
                          id:""
                        },
                        knowledgePoint:{
                          id:""
                        },
                        answer:""
                },
                batchForm: {
                  company:"",
                  text:""
                },
                //当前面试题详情
                detail:{
                  title:"",
                  course:{
                    id:""
                  },
                  knowledgePoint:{
                    id:""
                  },
                  answer:""
                },
                detailModal:false,
                batchModal:false,
                formRule: {
                    title: [
                        {required: true, message:'题目不能为空',trigger:'blur'}
                    ]
                    ,
                    courseId: [
                        {required: true, message:'课程不能为空',trigger:'blur'}
                    ]
                    ,
                    knowledgePointId: [
                        {required: true, message:'知识点不能为空',trigger:'blur'}
                    ]
                    ,
                    answer: [
                        {required: true, message:'答案不能为空',trigger:'blur'}
                    ]
                    ,
                    interiewId: [
                        {required: true, message:'所属面试不能为空',trigger:'blur'}
                    ]
                },
              batchFormRule: {
                company: [
                  {required: true, message:'公司名字不能为空',trigger:'blur'}
                ]
                ,
                text: [
                  {required: true, message:'不能为空',trigger:'blur'}
                ]
              },
                courseList:[],
                knowledgePointList:[],
                //批量导入为每个面试题准备单独的知识点列表
                knowledgePointLists:[],
                searchForm:{
                  courseId:"",
                  knowledgePointId:"",
                  title:""
                }
            }
        },
        methods: {
            change(e){
                this.count = e.length;
                if (e.length == 1) {
                  if(!e[0].course)
                  {
                    e[0].course = {}
                  }
                  if(!e[0].knowledgePoint)
                  {
                    e[0].knowledgePoint = {}
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
            addInterviewQuestion(){
                this.addModal = true;
            },
            //批量导入面试题
            batchInterviewQuestions(){
              this.batchModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const interviewQuestion = this.addForm;
                        axios.request({
                            url: '/api/interviewQuestion',
                            method: 'post',
                            data: interviewQuestion
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
            batchImport(){
              this.$refs['batchForm'].validate((valid)=>{
                if(valid)
                {
                  axios.request({
                    url: '/api/interviewQuestion/batchImport',
                    method: 'post',
                    data: {
                      company:this.batchForm.company,
                      interviewQuestionList:this.batchImportData
                    }
                  }).then((result) => {
                    this.gopage(this.pageNo);
                    this.$refs['batchForm'].resetFields();
                    this.$Message.success('批量导入成功!');
                    this.batchModal = false;
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
                    //加载出当前课程的所有知识点
                    this.queryKnowledgePoint(this.updateForm.course.id);
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        axios.request({
                            url: '/api/interviewQuestion',
                            method: 'put',
                            data: this.updateForm
                        }).then((result) => {
                            this.updateModal = false,
                                    this.$Message.success('操作成功!');
                            this.gopage(this.pageNo);
                        }).catch((result)=>{
                            this.$Message.error("哦豁，操作异常："+result);
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
                        url: '/api/interviewQuestion',
                        method: 'delete',
                        data: this.groupId
                    }).then((result) => {
                        if (result.data.code === 1) {
                            this.$Message.success('操作成功!');
                            this.gopage(this.pageNo);
                        }
                    }).catch((result)=>{
                        this.$Message.error("哦豁，操作异常："+result);
                    });
                } else {
                    this.$Message.warning('请至少选择一项');
                }
            },
            gopage(pageNo){
                this.tableLoding=true;
                this.pageNo = pageNo;
                const pageSize = this.page.size;
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/interviewQuestion/search',
                    method: 'post',
                    params: {pageNo, pageSize,keyWord},
                    data:this.searchForm
                }).then((result) => {
                                        this.page = result.data.data;
                    this.tableLoding=false;
                }).catch((result)=>{
                    this.$Message.error("哦豁，操作异常："+result);
                });
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            queryKnowledgePoint(courseId){

              // this.knowledgePointList = [];
              axios.request({
                url: '/api/knowledgePoint/all/'+courseId,
                method: 'get'
              }).then((result) => {
                this.knowledgePointList = result.data.data;
              }).catch((result)=>{
                this.$Message.error("哦豁，操作异常："+result);
              });
            },
            queryKnowledgePointForBatch(courseId,i){
              axios.request({
                url: '/api/knowledgePoint/all/'+courseId,
                method: 'get'
              }).then((result) => {
                if(result.data.data.length==0)
                {
                  this.knowledgePointLists[i] = [];
                }
                else
                {
                  //官网文档“以下两种数据变化vue无法检测，1.通过索引修改值。2.改变数组长度。”。。？
                  //so 需要概念数组引用
                  let newArray = JSON.parse(JSON.stringify(this.knowledgePointLists));
                  newArray[i] = result.data.data;
                  this.knowledgePointLists = newArray;
                }
                console.log('nothing')
              }).catch((result)=>{
                this.$Message.error("哦豁，操作异常："+result);
              });
            },
            wordToTable(){
              axios.request({
                url: '/api/interviewQuestion/wordToTable',
                method: 'post',
                data: {
                  text:this.batchForm.text
                }
              }).then((result) => {
                this.batchImportData = result.data.data;
              }).catch((result)=>{
                this.$Message.error({
                  content: '数据格式有错，在一问一答之间只能有两个换行符！',
                  duration: 10
                })

              });
            },
          //导出面试题
          exportData () {
              let data = JSON.parse(JSON.stringify(this.page.content)).map(i=>{
                if(i.knowledgePoint)
                {
                  i.knowledgePointName = i.knowledgePoint.name;
                }
                else
                {
                  i.knowledgePointName = '未知';
                }

                if(i.course)
                {
                  i.courseName = i.course.name;
                }
                else
                {
                  i.courseName = '未知';
                }
                return i;
              });
              // console.log(data);
              this.$refs.table.exportCsv({
                filename: '面试题',
                columns: this.columns1.filter((col, index) => index < 5),
                data: data
              });
          },
          changePS(size){
              this.page.size = size;
              this.gopage(this.pageNo);
          }

        },
        mounted: function () {

            this.gopage(this.pageNo);


            //courseList
            axios.request({
              url: '/api/course/all',
              method: 'get'
            }).then((result) => {
              this.courseList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });

        }
    }


</script>
