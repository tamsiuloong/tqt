<template>
    <Card>
        <Row>
            <Col span="8">
                <Input v-model="keyWord" placeholder="请输入面试题..." style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="error" icon="md-arrow-back" @click="backToInterviewList">返回</Button>
        </Row>
        <br>
        <Row>
                        <Table :loading="tableLoding" border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center" show-total></Page>
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
                                <Select v-model="addForm.course.id" style="width:200px" filterable @on-change="queryKnowledgePoint">
                                  <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="知识点" >
                              <Select v-model="addForm.knowledgePoint.id" style="width:200px" filterable >
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
                    // {
                    //   title: '答案',
                    //   width: 260,
                    //   key: 'answer'
                    // },
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
                        title: '知识点',
                        key: 'knowledgePointId',
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
                page: [],
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
                        answer:"",
                        interview:{
                          id:""
                        }
                },
                addForm: {
                        title:"",
                        course:{
                          id:""
                        },
                        knowledgePoint:{
                          id:""
                        },
                        answer:"",
                        interview:{
                          id:""
                        }
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
                  answer:"",
                  interview:{
                    id:""
                  }
                },
                detailModal:false,
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
                interviewId:null,
                courseList:[
                  {
                    id:"",
                    name:"--所有--"
                  }
                ],
                knowledgePointList:[]
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
            addInterviewQuestion(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const interviewQuestion = this.addForm;
                        interviewQuestion.interview.id = this.interviewId;
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
            gopage(pageNo){
                                this.tableLoding=true;
                this.pageNo = pageNo;
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                const interviewId = this.interviewId;
                axios.request({
                    url: '/api/interviewQuestion',
                    method: 'get',
                    params: {pageNo, pageSize,keyWord,interviewId}
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
              axios.request({
                url: '/api/knowledgePoint/all/'+courseId,
                method: 'get'
              }).then((result) => {
                this.knowledgePointList = result.data.data;
              }).catch((result)=>{
                this.$Message.error("哦豁，操作异常："+result);
              });
            },
            backToInterviewList(){
              this.$router.push({
                name: "查询面试记录"
              })
            }
        },
        mounted: function () {
            //面试记录id
            this.interviewId = getParams(window.location.href).id;

            this.gopage(this.pageNo);

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
        }
    }


</script>
