<template>
    <Card>
        <Row>
            <Col span="24">
              <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
                <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
              </Select>
              <Input v-model="searchForm.stuName" placeholder="学员名字" style="width:200px"/>
              <Input v-model="searchForm.companyName" placeholder="公司名字" style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addInterview()">新建面试记录</Button>
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
                              align="center" show-total></Page>
        </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加学员面试记录"
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
                        <FormItem label="面试公司" prop="companyName">
                          <Input type="text" v-model="addForm.companyName"/>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="公司地址" prop="companyAddr">
                          <Input type="text" v-model="addForm.companyAddr"/>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="11">
                        <FormItem label="面试时间" >
                          <DatePicker type="date" placeholder="Select date" format="yyyy-MM-dd" v-model="addForm.interviewTime" style="width: 200px"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="公司电话" prop="companyTel">
                          <Input type="text" v-model="addForm.companyTel"/>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="笔试情况">
                              <Select v-model="addForm.bsInfo" style="width:200px">
                                <Option v-for="item in infoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="面试情况">
                              <Select v-model="addForm.msInfo" style="width:200px">
                                <Option v-for="item in infoList" :value="item.value"  :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="附件" >
                              <Upload
                                multiple ref="appendixs" :on-success="handleSuccess4Add" :format="['jpg','jpeg','png','doc','docx','doc','docx']"
                                :max-size="204800" :on-error="handleAppendixError"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleExceededError"
                                :on-remove="handleRemove"
                                :before-upload="handleBeforeUpload4Add"
                                :data="{companyName:addForm.companyName}"
                                :action="uploadImagePath">
                                <Button icon="ios-cloud-upload-outline">上传照片附件</Button>
                              </Upload>
                              <span v-if="uploadAppendixFlag==1" style="color: red">正在上传...</span>
                              <span v-if="uploadAppendixFlag==2" style="color: green" v-for="a in updateForm.appendixs.split(',')">{{a}}<br></span>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="录音" >
                              <Upload ref="soundRecording"
                                :on-success="Success4Add" :format="['mp3','aac','m4a']"
                                :max-size="204800"
                                :on-error="handleSoundError"
                                :on-format-error="handleSoundFormatError"
                                :on-exceeded-size="handleSoundExceededError"
                                :show-upload-list="true"
                                :before-upload="handleSoundBeforeUpload4Add"
                                :data="{companyName:addForm.companyName}"
                                :action="uploadSoundPath">
                                <Button icon="ios-cloud-upload-outline">上传录音附件</Button>
                              </Upload>
                              <span v-if="uploadSoundFlag==1" style="color: red">正在上传...</span>
                              <span v-if="uploadSoundFlag==2" style="color: green">{{addForm.soundRecording}}</span>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="22">
                        <FormItem label="经验积累" >
<!--                          <Input v-model="addForm.experience" type="textarea" :rows="4" placeholder="说说你的感触,体会,心得或者下次面试需要改进的地方..." />-->

                          <quill-editor v-model="addForm.experience"
                                        ref="myQuillEditor"
                                        :options="editorOptionForShow"
                          >
                          </quill-editor>
                        </FormItem>
                      </Col>
                    </Row>
            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑学员面试记录"
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
                <FormItem label="面试公司" prop="companyName">
                  <Input type="text" v-model="updateForm.companyName"/>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="公司地址" prop="companyAddr">
                  <Input type="text" v-model="updateForm.companyAddr"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="11">
                <FormItem label="面试时间" >
                  <DatePicker type="date" placeholder="Select date" format="yyyy-MM-dd" v-model="updateForm.interviewTime" style="width: 200px"></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="公司电话" prop="companyTel">
                  <Input type="text" v-model="updateForm.companyTel"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="11">
                <FormItem label="笔试情况" prop="bsInfo">
                  <Select v-model="updateForm.bsInfo" style="width:200px">
                    <Option v-for="item in infoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="面试情况" prop="msInfo">
                  <Select v-model="updateForm.msInfo" style="width:200px">
                    <Option v-for="item in infoList" :value="item.value"  :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="11">
                <FormItem label="附件" >
                  <Upload ref="updateAppendixs"
                    multiple :on-success="handleSuccess4Add" :format="['jpg','jpeg','png','doc','docx']"
                    :max-size="10240" :on-error="handleAppendixError4Update"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleExceededError"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload4Update"
                    :data="{companyName:updateForm.companyName}"
                    action="">
                    <Button icon="ios-cloud-upload-outline">上传附件</Button>
                  </Upload>
                  <span v-if="uploadAppendixFlag==1" style="color: red">正在上传...</span>
                  <span v-if="uploadAppendixFlag==2" style="color: green" v-for="a in updateForm.appendixs.split(',')">{{a}}<br></span>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="录音" >
                  <Upload ref="updateSoundRecording"
                          :on-success="handleSoundSuccess" :format="['mp3','aac','m4a']"
                          :max-size="102400" :on-error="handleSoundError4Update"
                          :on-format-error="handleSoundFormatError"
                          :on-exceeded-size="handleSoundExceededError"
                          :show-upload-list="true"
                          :before-upload="handleSoundBeforeUpload4Update"
                          :data="{companyName:updateForm.companyName}"
                          action="">
                    <Button icon="ios-cloud-upload-outline">上传录音附件</Button>
                  </Upload>
                  <span v-if="uploadSoundFlag==1" style="color: red">正在上传...</span>
                  <span v-if="uploadSoundFlag==2" style="color: green">{{updateForm.soundRecording}}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- 循环便利row中的两个元素-->
              <Col span="22">
                <FormItem label="经验积累" >
<!--                  <Input v-model="updateForm.experience" type="textarea" :rows="4" placeholder="说说你的感触,体会,心得或者下次面试需要改进的地方..." />-->

                  <quill-editor v-model="updateForm.experience"
                                ref="myQuillEditor"
                                :options="editorOptionForShow"
                  >
                  </quill-editor>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

      <Modal
        v-model="appendixsModal"
        title="面试附件"
        @on-ok="ok"
        @on-cancel="cancel">
        <!--<vue-preview :slides="currAppendixs" @close="handleClose"></vue-preview>-->
        <li v-for="(img,i) in currAppendixs">附件{{i+1}}:<a  @click="openWindow(img)">{{img.substring(img.lastIndexOf("/")+1)}}</a></li>
<!--        <img v-for="img in currAppendixs" v-if="img" :src="img" width="40px" height="40px" @click="openWindow(img)"/>-->

      </Modal>
      <Modal
        v-model="audioModal"
        :title="audioTitle"
        @on-ok="closeAudioModal"
        @on-cancel="closeAudioModal"
      >
        <audio-x :audioSrc="audioSrc" ref="audiox"/>
      </Modal>
    </Card>
</template>

<script type="text/ecmascript-6">
    // import fetch from '../../utils/fetch';
    import { dateFormat } from '@/libs/date';
    import { setToken, getToken } from '@/libs/util'
    import axios from '@/libs/api.request'
    import config from '@/config'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import AudioX from '_c/audiox'
    import { quillEditor } from 'vue-quill-editor'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    let OSS = require('ali-oss')

    let client = new OSS({
      region: 'oss-cn-chengdu',
      //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
      accessKeyId: 'LTAI4Ftor1qjUDyduRFqiD4V',
      accessKeySecret: 'tfWJ4rSlpmsykiLZjcdj2K8lnYJIgB',
      bucket: 'tqt2020'
    });
    export default {
      components: {
        quillEditor,
        AudioX
      },
        data() {
            return {
                uploadAppendixFlag:0,
                uploadSoundFlag : 0,
                editorOptionForShow: {
                  // modules: {
                  //   toolbar: [
                  //     ['clean']
                  //   ]
                  // },
                  readOnly: false,
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
                        title: '学生',
                        key: 'user',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.user.userInfo.name)
                          ]);
                        }
                    },
                    {
                      title: '面试公司',
                      key: 'companyName'
                    },
                    {
                      title: '公司地址',
                      key: 'companyAddr'
                    },
                    {
                      title: '公司电话',
                      key: 'companyTel'
                    },
                    {
                      title: '面试时间',
                      width: 120,
                      key: 'interviewTime',
                      render: (h, params) => {
                        return h('div', [
                          h('strong', params.row.interviewTime.substr(0,10))
                        ]);
                      }
                    },
                    {
                        title: '笔试情况',
                        key: 'bsInfo',
                        render: (h, params) => {
                          const state = parseInt(params.row.bsInfo);
                          let str = "未参加";
                          if (state === 1) {
                            str= "优";
                          }
                          else if (state === 2) {
                            str= "良";
                          }else if (state === 3) {
                            str= "中";
                          }else if (state === 4) {
                            str= "差";
                          }


                          return h('div', [
                            h('strong', str)
                          ]);
                        }
                    },
                    {
                        title: '面试情况',
                        key: 'msInfo',
                        render: (h, params) => {
                          const state = parseInt(params.row.msInfo);
                          let str = "未参加";
                          if (state === 1) {
                            str= "优";
                          }
                          else if (state === 2) {
                            str= "良";
                          }else if (state === 3) {
                            str= "中";
                          }else if (state === 4) {
                            str= "差";
                          }


                          return h('div', [
                            h('strong', str)
                          ]);
                        }
                    },
                    {
                        title: '附件',
                        key: 'appendixs',
                    // <vue-preview :slides="slide1" @close="handleClose"></vue-preview>
                      render: (h, params) => {
                        if(params.row.appendixs)
                        {
                          return h('div', [
                            h('Button', {
                              props: {
                                type: 'primary',
                                size: 'small',
                                ghost:''
                              },
                              style: {
                                marginRight: '5px'
                              },
                              on: {
                                click: () => {
                                  // this.show(params.index);
                                  this.appendixsModal = true;
                                  this.appendixsIndex = params.index;
                                }
                              }
                            }, '查看')
                          ]);
                        }
                        else
                        {
                          return h('div', [
                            h('strong', "未上传")
                          ]);
                        }
                      }
                    },
                    {
                        title: '录音',
                        key: 'soundRecording',
                        render: (h, params) => {
                          if(params.row.soundRecording)
                          {
                            return h('div', [
                              h('a', {
                                on: {
                                  click: () => {
                                    // window.open(params.row.soundRecording);
                                    this.audioTitle = "面试录音:"+params.row.user.userInfo.name + "-"+params.row.companyName;
                                    this.audioSrc = params.row.soundRecording;
                                    this.audioModal = true;
                                  }
                                }
                              },'播放')
                            ]);
                          }
                          else {
                            return h('div', [
                              h('strong', "未上传")
                            ]);
                          }
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
                            type: 'success',
                            size: 'small',
                            ghost:''
                          },
                          on: {
                            click: () => {
                              this.$router.push({
                                name: "面试题",
                                query: { id: params.row.id }
                              })
                            }
                          }
                        }, '面试题管理')
                      ]);
                    }
                  }
                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        bsInfo:"0",
                        msInfo:"0",
                        appendixs:"",
                        soundRecording:"",
                        companyName:"",
                        companyAddr:"",
                        companyTel:"",
                        interviewTime:"",
                        experience:""
                },
                addForm: {
                        bsInfo:"0",
                        msInfo:"0",
                        appendixs:"",
                        soundRecording:"",
                        companyName:"",
                        companyAddr:"",
                        companyTel:"",
                        interviewTime:"",
                        experience:""
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    userId: [
                        {required: true, message:'学生不能为空',trigger:'blur'}
                    ]
                    ,
                    bsInfo: [
                        {required: true, message:'笔试情况不能为空',trigger:'blur'}
                    ]
                    ,
                    msInfo: [
                        {required: true, message:'面试情况不能为空',trigger:'blur'}
                    ]
                    ,
                    appendixs: [
                        {required: true, message:'附件不能为空',trigger:'blur'}
                    ]
                    ,
                    soundRecording: [
                        {required: true, message:'录音不能为空',trigger:'blur'}
                    ]
                    ,
                    companyName: [
                        {required: true, message:'面试公司不能为空',trigger:'blur'}
                    ]
                    ,
                    createTime: [
                        {required: true, message:'创建日期不能为空',trigger:'blur'}
                    ]
                    ,
                    companyAddr: [
                        {required: true, message:'公司地址不能为空',trigger:'blur'}
                    ]
                    ,
                    companyTel: [
                        {required: true, message:'公司电话不能为空',trigger:'blur'}
                    ]
                    ,
                    interviewTime: [
                        {required: true, message:'面试时间不能为空',trigger:'blur'}
                    ]
                },
                //情况列表
                infoList: [
                  {
                    value: '0',
                    label: '未参加'
                  },
                  {
                    value: '1',
                    label: '优'
                  },
                  {
                    value: '2',
                    label: '良'
                  },
                  {
                    value: '3',
                    label: '中'
                  },
                  {
                    value: '4',
                    label: '差'
                  }
                ],
                //附件上传路径
                uploadImagePath:"",
                //录音上传路径
                uploadSoundPath:"",
                //附件列表
                appendixs:[],
                appendixsModal:false,
                appendixsIndex:0,
                classesList:[
          {
            id:"",
            name:"--所有--"
          }
        ],
                searchForm:{
                  classId:"",
                  stuName:"",
                  companyName:""
                },
                audioModal:false,
                audioSrc:"",
                audioTitle:""
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
            addInterview(){
              this.$refs.appendixs.clearFiles();
              this.$refs.soundRecording.clearFiles();
              this.reset("addForm");
              //清空
              this.addForm={
                bsInfo:"0",
                msInfo:"0",
                appendixs:"",
                soundRecording:"",
                companyName:"",
                companyAddr:"",
                companyTel:"",
                interviewTime:""
              };
              this.appendixs=[];
              this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        //莫名奇妙就少一天
                        let interviewTime = this.addForm.interviewTime;
                        if(interviewTime instanceof Date)
                        {
                          interviewTime.setDate(interviewTime.getDate() + 1);
                        }

                        const interview = this.addForm;
                        axios.request({
                            url: '/api/interview',
                            method: 'post',
                            data: interview
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
                    this.$refs.updateAppendixs.clearFiles();
                    this.$refs.updateSoundRecording.clearFiles();
                    this.appendixs=[];
                    this.updateForm.appendixs="";
                    this.updateForm.soundRecording="";
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        let interviewTime = this.updateForm.interviewTime;
                        if(interviewTime instanceof Date)
                        {
                          interviewTime.setDate(interviewTime.getDate() + 1);
                        }

                        axios.request({
                            url: '/api/interview',
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
                        url: '/api/interview',
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
              const pageSize = this.pageSize;
              const keyWord = this.keyWord;
              axios.request({
                url: '/api/interview/search/false',
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
            handleSoundSuccess(res, file,fileList) {
              file.url = baseUrl+res;
              file.name = res;
              this.updateForm.soundRecording = res;
            },

            Success4Add(res, file,fileList) {
              file.url = baseUrl+res;
              file.name = res;
              this.addForm.soundRecording = res;
            },
            handleBeforeUpload4Add(){
              if(!this.addForm.companyName)
              {
                this.$Message.warning("请先填写公司名字!")
                return false;
              }
            },
            handleSoundBeforeUpload4Add(){
              if(!this.addForm.companyName)
              {
                this.$Message.warning("请先填写公司名字!")
                return false;
              }
              this.$refs.soundRecording.clearFiles();
            },
            handleBeforeUpload4Update(){
              if(!this.updateForm.companyName)
              {
                this.$Message.warning("请先填写公司名字!")
                return false;
              }
            },
            handleSoundBeforeUpload4Update(){
              if(!this.updateForm.companyName)
              {
                this.$Message.warning("请先填写公司名字!")
                return false;
              }
              this.$refs.soundRecording.clearFiles();
            },
            handleSuccess4Add (res, file,fileList) {
              //console.log(res);
              //console.log(file);
              file.url = baseUrl+res;
              file.name = res;
              this.appendixs.push(file);
              this.computeAppendixs(this.appendixs)
              // this.addForm.appendixs = this.appendixs.reduce((a,b)=>{
              //   return a.name+","+b.name;
              // });
            },
            computeAppendixs(appendixs){
              let str = "";
              for(let i = 0 ;i < appendixs.length;i++)
              {
                str+=appendixs[i].name;
                if(i+1<appendixs.length)
                {
                  str +=",";
                }
              }
              this.addForm.appendixs = str;
              this.updateForm.appendixs = str;
            },
            handleAppendixError ( error, file, fileList) {
              // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
              let fileName = this.addForm.companyName+"_"+fileList.name;
              this.uploadAppendixFlag = 1;
              client.put('appendix/'+fileName, fileList).then( (r1)=> {
                if(this.addForm.appendixs!='')
                {
                  this.addForm.appendixs+=","+fileName;
                }
                else
                {
                  this.addForm.appendixs+=fileName;
                }

                this.uploadAppendixFlag = 2;
              }).catch( (err)=> {
                this.uploadAppendixFlag = 1;
              });
            },
            handleAppendixError4Update ( error, file, fileList) {
              // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
              let fileName = this.updateForm.companyName+"_"+fileList.name;
              this.uploadAppendixFlag = 1;
              client.put('appendix/'+fileName, fileList).then( (r1)=> {
                if(this.updateForm.appendixs!='')
                {
                  this.updateForm.appendixs+=","+fileName;
                }
                else
                {
                  this.updateForm.appendixs+=fileName;
                }

                this.uploadAppendixFlag = 2;
              }).catch( (err)=> {
                this.uploadAppendixFlag = 1;
              });
            },
            handleSoundError ( error, file, fileList) {
              // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
              let fileName = this.addForm.companyName+"_"+fileList.name;
              this.uploadSoundFlag = 1;
              client.put('sound/'+fileName, fileList).then( (r1)=> {
                // console.log('put success: %j', r1);
                this.addForm.soundRecording=fileName;
                this.uploadSoundFlag = 2;
              }).catch( (err)=> {
                // console.error('error: %j', err);
                this.uploadSoundFlag = 1;
              });
             // this.$Message.error(error);
            },
            handleSoundError4Update ( error, file, fileList) {
              // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
              let fileName = this.updateForm.companyName+"_"+fileList.name;
              this.uploadSoundFlag = 1;
              client.put('sound/'+fileName, fileList).then( (r1)=> {
                // console.log('put success: %j', r1);
                this.updateForm.soundRecording=fileName;
                this.uploadSoundFlag = 2;
              }).catch( (err)=> {
                // console.error('error: %j', err);
                this.uploadSoundFlag = 1;
              });
            },
            handleFormatError(file) {
              this.$Message.error("文件["+file.name+"]格式不对，只能是'jpg','jpeg','png','doc','docx'");
            },
            handleExceededError(file){
              this.$Message.error("文件["+file.name+"]不能超过10M,小伙子手机像素可以呀！");
            },
            handleSoundFormatError(file) {
              this.$Message.error("文件["+file.name+"]格式不对，只能是'mp3','aac','m4a'");
            },
            handleSoundExceededError(file){
              this.$Message.error("文件["+file.name+"]不能超过50MB！");
            },
            handleRemove(file,fileList)
            {
              //清楚在模型数据中的附件
              this.appendixs=this.appendixs.filter(a=>a.name!=file.name);
              this.computeAppendixs(fileList);
              let s = "";
              s.split()
            },
            openWindow (img) {
              window.open(img);
            },
            //关闭播放窗口
            closeAudioModal(){
              this.audioModal = false;
              // this.pauseAudio();

              this.$refs.audiox.pauseAudio();
            }
        },
        created: function () {
            this.gopage(this.pageNo);
            this.uploadImagePath=baseUrl+'api/uploadFiles/1?access_token='+getToken();
            this.uploadSoundPath=baseUrl+'api/uploadFiles/2?access_token='+getToken();
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
        },
        computed:{
          currAppendixs(){
            if(this.page.content&&this.page.content.length>0)
            {
              let result = this.page.content[this.appendixsIndex].appendixs.split(',');
              // result =  result.map(img=>{
              //   return {
              //     src: img,
              //     msrc: img,
              //     alt: '附件',
              //     title: '附件',
              //     w: 600,
              //     h: 900
              //   }
              // })
              return result;
            }
            return [];
          }
        }
    }


</script>
