<template>
    <Card>
        <Row>
            <Col span="24">
              <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
                <Option v-for="c in classesList" :value="c.id">{{c.name}}</Option>
              </Select>
              <Input v-model="searchForm.stuName" placeholder="学员名字" style="width:200px"/>
              <Input v-model="searchForm.companyName" placeholder="公司名字" style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addInterview()">新建面试记录</Button>
                    <Button type="success" icon="ios-build" @click="edit()">修改</Button>
                    <Button type="error" icon="ios-trash" @click="remove()">删除</Button>
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
                            <FormItem label="笔试情况" prop="bsInfo">
                              <Select v-model="addForm.bsInfo" style="width:200px">
                                <Option v-for="item in infoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="面试情况" prop="msInfo">
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
                                multiple ref="appendixs" :on-success="handleSuccess" :format="['jpg','jpeg','png']"
                                :max-size="5120" :on-error="handleError"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleExceededError"
                                :on-remove="handleRemove"
                                :action="uploadImagePath">
                                <Button icon="ios-cloud-upload-outline">上传照片附件</Button>
                              </Upload>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="录音" >
                              <Upload ref="soundRecording"
                                :on-success="handleSoundSuccess" :format="['mp3','aac','m4a']"
                                :max-size="51200" :on-error="handleError"
                                :on-format-error="handleSoundFormatError"
                                :on-exceeded-size="handleSoundExceededError"
                                :show-upload-list="true"
                                :before-upload="handleSoundBeforeUpload"
                                :action="uploadSoundPath">
                                <Button icon="ios-cloud-upload-outline">上传照片附件</Button>
                              </Upload>
                            </FormItem>
                            </Col>
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
                    multiple :on-success="handleSuccess" :format="['jpg','jpeg','png']"
                    :max-size="5120" :on-error="handleError"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleExceededError"
                    :on-remove="handleRemove"
                    :action="uploadImagePath">
                    <Button icon="ios-cloud-upload-outline">上传照片附件</Button>
                  </Upload>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center"/>
              <Col span="11">
                <FormItem label="录音" >
                  <Upload ref="updateSoundRecording"
                          :on-success="handleSoundSuccess" :format="['mp3','aac','m4a']"
                          :max-size="51200" :on-error="handleSoundError"
                          :on-format-error="handleSoundFormatError"
                          :on-exceeded-size="handleSoundExceededError"
                          :show-upload-list="true"
                          :before-upload="handleSoundBeforeUpload"
                          :action="uploadSoundPath">
                    <Button icon="ios-cloud-upload-outline">上传照片附件</Button>
                  </Upload>
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
        <img v-for="img in currAppendixs" :src="img" width="40px" height="40px" @click="openWindow(img)"/>
      </Modal>

    </Card>
</template>

<script type="text/ecmascript-6">
    // import fetch from '../../utils/fetch';
    import { dateFormat } from '@/libs/date';
    import { setToken, getToken } from '@/libs/util'
    import axios from '@/libs/api.request'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

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
                          let str = "未知";
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
                          let str = "未知";
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
                                // this.show(params.index);
                                this.appendixsModal = true;
                                this.appendixsIndex = params.index;
                              }
                            }
                          }, '查看')
                        ]);
                      }
                    },
                    {
                        title: '录音',
                        key: 'soundRecording',
                        render: (h, params) => {
                          return h('div', [
                            h('a', {
                              on: {
                                click: () => {
                                  window.open(params.row.soundRecording);
                                }
                              }
                            },'播放')
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
                        bsInfo:"",
                        msInfo:"",
                        appendixs:"",
                        soundRecording:"",
                        companyName:"",
                        companyAddr:"",
                        companyTel:"",
                        interviewTime:""
                },
                addForm: {
                        bsInfo:"",
                        msInfo:"",
                        appendixs:"",
                        soundRecording:"",
                        companyName:"",
                        companyAddr:"",
                        companyTel:"",
                        interviewTime:""
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
                classesList:[],
                searchForm:{
                  classId:"",
                  stuName:"",
                  companyName:""
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
            addInterview(){
              this.$refs.appendixs.clearFiles();
              this.$refs.soundRecording.clearFiles();
              this.reset("addForm");
              //清空
              this.addForm={
                bsInfo:"",
                msInfo:"",
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
                        const interview = this.addForm;
                        axios.request({
                            url: '/api/interview',
                            method: 'post',
                            data: interview
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
                        axios.request({
                            url: '/api/interview',
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
                        url: '/api/interview',
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
                    url: '/api/interview/search',
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
            handleSoundSuccess(res, file,fileList) {
              file.url = baseUrl+res;
              file.name = res;
              this.addForm.soundRecording = res;
            },
            handleSoundBeforeUpload(){
              this.$refs.soundRecording.clearFiles();
            },
            handleSuccess (res, file,fileList) {
              console.log(res);
              console.log(file);
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
            handleError ( error, file, fileList) {
             this.$Message.error(error);
            },
            handleFormatError(file) {
              this.$Message.error("文件["+file.name+"]格式不对，只能是'jpg','jpeg','png'");
            },
            handleExceededError(file){
              this.$Message.error("文件["+file.name+"]不能超过5MB,小伙子手机像素可以呀！");
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
            }
        },
        created: function () {
            this.gopage();
            this.uploadImagePath=baseUrl+'api/uploadFiles/1?access_token='+getToken();
            this.uploadSoundPath=baseUrl+'api/uploadFiles/2?access_token='+getToken();
            axios.request({
              url: '/api/classes/all',
              method: 'get'
            }).then((result) => {
              this.classesList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("操作异常："+result);
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
