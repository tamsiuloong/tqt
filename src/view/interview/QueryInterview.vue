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
<!--        <br>-->
<!--        <Row>-->
<!--                    <Button type="success" icon="ios-build" @click="edit()">查询</Button>-->
<!--        </Row>-->
        <br>
        <Row>
                        <Table  :loading="tableLoding" border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
        </Row>
        <br>
        <Row>
                        <Page  :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center" show-total></Page>
        </Row>
        <br>

        <Modal
                v-model="updateModal"
                title="查看学员信息跟踪"
                :mask-closable="true"
                :loading="loading"
                @on-ok="closeModal"
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
<!--        <img v-for="img in currAppendixs" v-if="img" :src="img" width="40px" height="40px" @click="openWindow(img)"/>-->
        <li v-for="(img,i) in currAppendixs">附件{{i+1}}:<a  @click="openWindow(img)">{{img.substring(img.lastIndexOf("/")+1)}}</a></li>
      </Modal>



      <Modal
        v-model="audioModal"
        title="播放录音"
        @on-ok="closeAudioModal"
        @on-cancel="closeAudioModal"
        >
        <div class="container_box" id="audio_detail">
          <div>
            <audio autoplay="autoplay" id="audioPlayer" preload="auto" :src="audioSrc">
              你的浏览器不支持audio标签
            </audio>
            <div class="audioBox">
              <div class="audioBox_top">
                <div class="audioBox_left">
                  {{audioCurrentTime}}
                </div>
                <div class="audioBox_slider">
                  <van-slider v-model="audioTime" @change="onChange" bar-height="4px"/>
                </div>
                <div class="audioBox_right">
                  {{audioAllTime}}
                </div>
                <div class="clear"></div>
              </div>
              <div class="audioBox_control">
                <!--播放按钮-->
                <i class="iconfont icon-bofang1 iconfont_control" @click="playAudio" v-show="!isPlay">播放</i>
                <!--暂停按钮-->
                <i class="iconfont icon-zanting iconfont_control" @click="pauseAudio" v-show="isPlay">暂停</i>
                <!--设置倍速播放-->
                <div class="audioBox_multiple" @click="changeMultiple">
                  <div class="multiple_number">{{multipleArray[multipleIndex]}}X</div>
                  <div class="multiple_des">倍速播放</div>
                </div>
              </div>

            </div>


          </div>

        </div>
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
    import 'vant/lib/index.css';
    import { quillEditor } from 'vue-quill-editor'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    let audioInterval;
    export default {
      components: {
        quillEditor
      },
        data() {
            return {
                editorOptionForShow: {
                  // modules: {
                  //   toolbar: [
                  //     ['clean']
                  //   ]
                  // },
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
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
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
                    width: 140,
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
                                this.updateForm = params.row;
                                this.updateModal = true;
                                this.$refs.updateAppendixs.clearFiles();
                                this.$refs.updateSoundRecording.clearFiles();
                                this.appendixs=[];
                                this.updateForm.appendixs="";
                                this.updateForm.soundRecording="";
                              }
                            }
                           }, '详情'),
                        h('Button', {
                          props: {
                            type: 'success',
                            size: 'small',
                            ghost:''
                          },
                          on: {
                            click: () => {
                              this.$router.push({
                                name: "查看面试题",
                                query: { id: params.row.id }
                              })
                            }
                          }
                        }, '面试题')
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
                        interviewTime:"",
                        experience:""
                },
                addForm: {
                        bsInfo:"",
                        msInfo:"",
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
                },

                audioModal:false,
                audioTime:0,//音频进度百分比
                audioCurrentTime:'00:00',//音频当前播放时间
                audioAllTime:'00:00',//音频总播放时间
                audioAllDuration:0,//音频总播放秒数
                isPlay:false,//是否正在播放
                multipleArray:[0.75,1,1.5,2,2.5,3],
                multipleIndex:1,
                audioSrc:""
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
            closeModal () {
                this.updateModal=false;
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
                    url: '/api/interview/search/true',
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
            openWindow (img) {
              window.open(img);
            },

            //设置定时检测
            setAudioInterval(){
              audioInterval = setInterval(()=>{
                this.getAudioTime();
                let audioPlayer = document.getElementById('audioPlayer');
                if(audioPlayer.ended){
                  //播放结束后重置数据
                  clearInterval(audioInterval);
                  this.audioTime=0;
                  audioPlayer.currentTime = 0;
                  this.audioCurrentTime='00:00';
                  this.isPlay=false;
                }
                audioPlayer.paused?this.isPlay=false:this.isPlay=true
              },500)
            },
            //播放
            playAudio(){
              //重设定时器
              clearInterval(audioInterval);
              this.getAudioTime();
              this.setAudioInterval();
              document.getElementById('audioPlayer').play();
              this.isPlay=true;
            },
            //暂停
            pauseAudio(){
              document.getElementById('audioPlayer').pause();
              this.isPlay=false;
            },
            //获取播放时间
            getAudioTime(){
              let audioPlayer = document.getElementById('audioPlayer');
              // console.log("播放总时间--"+realFormatSecond(audioPlayer.duration));
              // console.log("已播放秒数--"+realFormatSecond(audioPlayer.currentTime));
              //展示用
              this.audioAllTime = realFormatSecond(audioPlayer.duration);
              this.audioAllDuration = audioPlayer.duration;
              this.audioCurrentTime = realFormatSecond(audioPlayer.currentTime);
              //计算当前进度百分比
              this.audioTime = (audioPlayer.currentTime*100/audioPlayer.duration).toFixed(3);
              // console.log("百分比--"+this.audioTime)
            },
            //滑动进度条
            onChange(value){
              // 设置播放时间
              let audioPlayer = document.getElementById('audioPlayer');
              console.log("before:"+audioPlayer.currentTime);
              this.audioCurrentTime =  this.audioAllDuration*value/100;
              console.log(parseInt(this.audioAllDuration*value/100));
              audioPlayer.currentTime = parseInt(this.audioAllDuration*value/100);
              console.log("after:"+audioPlayer.currentTime);
            },
            //设置倍速播放
            changeMultiple(){
              if(this.multipleIndex<5){
                this.multipleIndex++
              }else{
                this.multipleIndex=0
              }
              let audioPlayer = document.getElementById('audioPlayer');
              audioPlayer.playbackRate = this.multipleArray[this.multipleIndex]
            },
            //关闭播放窗口
            closeAudioModal(){
                this.audioModal = false;
                this.pauseAudio();
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
              this.classesList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });

            this.setAudioInterval();
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

    //格式化秒
    function realFormatSecond(second) {
      var secondType = typeof second
      if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        // var hours = Math.floor(second / 3600)
        // second = second - hours * 3600
        second = second
        var mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      } else {
        return '00:00'
      }
    }
</script>
<style>
  body {
    background: #fff;
  }

  .audio_cover {
    width: 100%;
  }

  .audio_title {
    font-size: 18px;
    padding: 15px 10px;
    /*margin-bottom: 10px;*/
  }

  .audio_des {
    padding: 0 15px;

  }
  .aplayer-icon-mode{
    display: none!important;
  }
  /*自定义音频器*/
  .audioBox{
    padding: 10px 15px;
  }
  .audioBox_top{
    line-height: 24px;
  }
  .audioBox_left{
    float: left;
    color: #999;
    font-size: 12px;
    width: 14%;
    text-align: left;
  }
  .audioBox_slider{
    float: left;
    width: 72%;
    margin-top: 10px;
  }
  .audioBox_right{
    float: left;
    color: #999;
    font-size: 12px;
    width: 14%;
    text-align: center;
  }
  .van-slider__button{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #18aefc;
    border: 4px solid #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,.5);
  }
  .audioBox_control{
    text-align: center;
    margin-top: 15px;
    position: relative;
  }
  .iconfont_control{
    display: inline-block;
    margin: 0 auto;
    font-size: 54px;
    color: #18aefc;
  }
  .audioBox_multiple{
    position: absolute;
    right: 28px;
    top: 15px;
    color: #b4b4b4;
  }
  .multiple_number{
    margin-bottom: 6px;
    font-size: 14px;
  }
  .multiple_des{
    font-size: 12px;
  }
  /*自定义音频器*/
</style>
