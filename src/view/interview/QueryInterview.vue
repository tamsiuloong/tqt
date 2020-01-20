<template>
    <Card>
        <Row>
            <Col span="24">
              <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
                <Option v-for="c in classesList" :value="c.id">{{c.name}}<span v-if="c.type">-</span>{{c.type}}</Option>
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
import { dateFormat } from '@/libs/date'
import { setToken, getToken } from '@/libs/util'
import axios from '@/libs/api.request'
import config from '@/config'
import AudioX from '_c/audiox'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  components: {
    quillEditor,
    AudioX
  },
  data () {
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
      tableLoding: true,
      loading: true,
      count: 0,
      gourpId: null,
      pageSize: 20,
      pageNo: 1,
      totalPage: 0,
      totalCount: 0,
      keyWord: '',
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
            ])
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
              h('strong', params.row.interviewTime.substr(0, 10))
            ])
          }
        },
        {
          title: '笔试情况',
          key: 'bsInfo',
          render: (h, params) => {
            const state = parseInt(params.row.bsInfo)
            let str = '未参加'
            if (state === 1) {
              str = '优'
            } else if (state === 2) {
              str = '良'
            } else if (state === 3) {
              str = '中'
            } else if (state === 4) {
              str = '差'
            }

            return h('div', [
              h('strong', str)
            ])
          }
        },
        {
          title: '面试情况',
          key: 'msInfo',
          render: (h, params) => {
            const state = parseInt(params.row.msInfo)
            let str = '未参加'
            if (state === 1) {
              str = '优'
            } else if (state === 2) {
              str = '良'
            } else if (state === 3) {
              str = '中'
            } else if (state === 4) {
              str = '差'
            }

            return h('div', [
              h('strong', str)
            ])
          }
        },
        {
          title: '附件',
          key: 'appendixs',
          // <vue-preview :slides="slide1" @close="handleClose"></vue-preview>
          render: (h, params) => {
            if (params.row.appendixs) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    ghost: ''
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.show(params.index);
                      this.appendixsModal = true
                      this.appendixsIndex = params.index
                    }
                  }
                }, '查看')
              ])
            } else {
              return h('div', [
                h('strong', '未上传')
              ])
            }
          }
        },
        {
          title: '录音',
          key: 'soundRecording',
          render: (h, params) => {
            if (params.row.soundRecording) {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.audioTitle = '面试录音:' + params.row.user.userInfo.name + '-' + params.row.companyName
                      this.audioSrc = params.row.soundRecording
                      this.audioModal = true
                    }
                  }
                }, '播放')
              ])
            } else {
              return h('div', [
                h('strong', '未上传')
              ])
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
                  ghost: ''
                },
                on: {
                  click: () => {
                    this.updateForm = params.row
                    this.updateModal = true
                    this.$refs.updateAppendixs.clearFiles()
                    this.$refs.updateSoundRecording.clearFiles()
                    this.appendixs = []
                    this.updateForm.appendixs = ''
                    this.updateForm.soundRecording = ''
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  ghost: ''
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: '查看面试题',
                      query: { id: params.row.id }
                    })
                  }
                }
              }, '面试题')
            ])
          }
        }
      ],
      self: this,
      page: [],
      updateModal: false,
      addModal: false,
      updateForm: {
        bsInfo: '',
        msInfo: '',
        appendixs: '',
        soundRecording: '',
        companyName: '',
        companyAddr: '',
        companyTel: '',
        interviewTime: '',
        experience: ''
      },
      addForm: {
        bsInfo: '',
        msInfo: '',
        appendixs: '',
        soundRecording: '',
        companyName: '',
        companyAddr: '',
        companyTel: '',
        interviewTime: '',
        experience: ''
      },
      formRule: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '学生不能为空', trigger: 'blur' }
        ],
        bsInfo: [
          { required: true, message: '笔试情况不能为空', trigger: 'blur' }
        ],
        msInfo: [
          { required: true, message: '面试情况不能为空', trigger: 'blur' }
        ],
        appendixs: [
          { required: true, message: '附件不能为空', trigger: 'blur' }
        ],
        soundRecording: [
          { required: true, message: '录音不能为空', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '面试公司不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建日期不能为空', trigger: 'blur' }
        ],
        companyAddr: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' }
        ],
        companyTel: [
          { required: true, message: '公司电话不能为空', trigger: 'blur' }
        ],
        interviewTime: [
          { required: true, message: '面试时间不能为空', trigger: 'blur' }
        ]
      },
      // 情况列表
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
      // 附件上传路径
      uploadImagePath: '',
      // 录音上传路径
      uploadSoundPath: '',
      // 附件列表
      appendixs: [],
      appendixsModal: false,
      appendixsIndex: 0,
      classesList: [
        {
          id: '',
          name: '--所有--'
        }
      ],
      searchForm: {
        classId: '',
        stuName: '',
        companyName: ''
      },

      audioModal: false,
      audioSrc: '',
      audioTitle: ''
    }
  },
  methods: {
    change (e) {
      this.count = e.length
      if (e.length == 1) {
        this.updateForm = e[0]
      }
      this.setGroupId(e)
    },
    setGroupId (e) {
      this.groupId = []

      for (var i = 0; i < e.length; i++) {
        this.groupId.push(e[i].id)
      }
    },
    reset (form) {
      this.$refs[form].resetFields()
    },
    addInterview () {
      this.$refs.appendixs.clearFiles()
      this.$refs.soundRecording.clearFiles()
      this.reset('addForm')
      // 清空
      this.addForm = {
        bsInfo: '',
        msInfo: '',
        appendixs: '',
        soundRecording: '',
        companyName: '',
        companyAddr: '',
        companyTel: '',
        interviewTime: ''
      }
      this.appendixs = []
      this.addModal = true
    },
    add () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const interview = this.addForm
          axios.request({
            url: '/api/interview',
            method: 'post',
            data: interview
          }).then((result) => {
            this.gopage(this.pageNo)
            this.$refs['addForm'].resetFields()
            this.$Message.success('操作成功!')
            this.addModal = false
          })
        } else {
          this.$Message.error('表单验证失败')
          setTimeout(() => {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }, 1000)
        }
      })
    },
    edit () {
      if (this.count != 1) {
        this.updateModal = false
        this.$Message.warning('请至少并只能选择一项')
      } else {
        this.updateModal = true
        this.$refs.updateAppendixs.clearFiles()
        this.$refs.updateSoundRecording.clearFiles()
        this.appendixs = []
        this.updateForm.appendixs = ''
        this.updateForm.soundRecording = ''
      }
    },
    closeModal () {
      this.updateModal = false
    },
    remove () {
      if (this.groupId != null && this.groupId != '') {
        axios.request({
          url: '/api/interview',
          method: 'delete',
          data: this.groupId
        }).then((result) => {
          if (result.data.code === 1) {
            this.$Message.success('操作成功!')
            this.gopage(this.pageNo)
          }
        }).catch((result) => {
          this.$Message.error('哦豁，操作异常：' + result)
        })
      } else {
        this.$Message.warning('请至少选择一项')
      }
    },
    gopage (pageNo) {
      this.tableLoding = true
      this.pageNo = pageNo
      const pageSize = this.pageSize
      const keyWord = this.keyWord
      axios.request({
        url: '/api/interview/search/true',
        method: 'post',
        params: { pageNo, pageSize, keyWord },
        data: this.searchForm
      }).then((result) => {
        this.page = result.data.data
        this.tableLoding = false
      }).catch((result) => {
        this.$Message.error('哦豁，操作异常：' + result)
      })
    },
    cancel () {
      this.$Message.info('点击了取消')
    },
    computeAppendixs (appendixs) {
      let str = ''
      for (let i = 0; i < appendixs.length; i++) {
        str += appendixs[i].name
        if (i + 1 < appendixs.length) {
          str += ','
        }
      }
      this.addForm.appendixs = str
      this.updateForm.appendixs = str
    },
    openWindow (img) {
      window.open(img)
    },

    // 关闭播放窗口
    closeAudioModal () {
      this.audioModal = false
      // this.pauseAudio();

      this.$refs.audiox.pauseAudio()
    }
  },
  created: function () {
    this.gopage(this.pageNo)
    this.uploadImagePath = baseUrl + 'api/uploadFiles/1?access_token=' + getToken()
    this.uploadSoundPath = baseUrl + 'api/uploadFiles/2?access_token=' + getToken()
    axios.request({
      url: '/api/classes/all',
      method: 'get'
    }).then((result) => {
      result.data.data.forEach(classes => {
        this.classesList.push(classes)
      })
    }).catch((result) => {
      this.$Message.error('哦豁，操作异常：' + result)
    })
  },
  computed: {
    currAppendixs () {
      if (this.page.content && this.page.content.length > 0) {
        let result = this.page.content[this.appendixsIndex].appendixs.split(',')
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
        return result
      }
      return []
    }
  }
}

</script>
