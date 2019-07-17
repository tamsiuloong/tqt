<template>
    <Card>
        <Row>
            <Col span="8">
                <Input v-model="keyWord" placeholder="请输入投票主题..." style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addVoteTopic()">新建</Button>
                    <!--<Button type="success" icon="ios-build" @click="edit()">修改</Button>-->
                    <Button type="error" icon="ios-trash" @click="remove()">删除</Button>
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
                title="添加投票主题"
                :mask-closable="true"
                :loading="loading"
                @on-ok="add"
                @on-cancel="cancel"
                width="80%">
            <Form ref="addForm" :model="addForm" :rules="formRule" :label-width="80">

                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="标题" prop="title">
                                <Input type="text" v-model="addForm.title"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="描述" prop="description">
                                <Input type="text" v-model="addForm.description"/>
                            </FormItem>
                            </Col>
                    </Row>

                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="班级" prop="classes.id">

                              <Select filterable="true" placeholder="班级" v-model="addForm.classes.id" style="width:200px">
                                <Option v-for="c in classesList" :value="c.id">{{c.name}}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="老师" prop="teacher.id">
                              <Select filterable="true" placeholder="老师" v-model="addForm.teacher.id" style="width:200px">
                                <Option v-for="c in teacherList" :value="c.id">{{c.userInfo.name}}</Option>
                              </Select>
                            </FormItem>
                            </Col>
                    </Row>

                  <FormItem
                    v-for="(item, index) in addForm.items"
                    v-if="item.status"
                    :key="index"
                    :label="'调查项 ' + item.index"
                    :prop="'items.' + index + '.value'"
                    :rules="{required: true, message: '调查项 ' + item.index +'不能为空', trigger: 'blur'}">
                    <Row>
                      <Col span="18">
                        <Input type="text" v-model="item.value" placeholder="输入"></Input>
                      </Col>
                      <Col span="4" offset="1">
                        <Button @click="handleRemove(index)">删除调查项</Button>
                      </Col>
                    </Row>
                  </FormItem>


                  <FormItem>
                    <Row>
                      <Col span="12">
                        <Button type="dashed" long @click="handleAdd" icon="md-add">添加调查项</Button>
                      </Col>
                    </Row>
                  </FormItem>
            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑投票主题"
                :mask-closable="true"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="80%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">

                    <Row>
                            <Col span="11">
                            <FormItem label="" prop="votetopicId">
                                <Input type="text" v-model="updateForm.votetopicId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="" prop="siteId">
                                <Input type="text" v-model="updateForm.siteId"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="标题" prop="title">
                                <Input type="text" v-model="updateForm.title"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="描述" prop="description">
                                <Input type="text" v-model="updateForm.description"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="开始时间" prop="startTime">
                                <Input type="text" v-model="updateForm.startTime"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="结束时间" prop="endTime">
                                <Input type="text" v-model="updateForm.endTime"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="重复投票限制时间，单位小时，为空不允许重复投票" prop="repeateHour">
                                <Input type="text" v-model="updateForm.repeateHour"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="总投票数" prop="totalCount">
                                <Input type="text" v-model="updateForm.totalCount"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="最多可以选择几项" prop="multiSelect">
                                <Input type="text" v-model="updateForm.multiSelect"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否限制会员" prop="isRestrictMember">
                                <Input type="text" v-model="updateForm.isRestrictMember"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="是否限制IP" prop="isRestrictIp">
                                <Input type="text" v-model="updateForm.isRestrictIp"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否限制COOKIE" prop="isRestrictCookie">
                                <Input type="text" v-model="updateForm.isRestrictCookie"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="是否禁用" prop="isDisabled">
                                <Input type="text" v-model="updateForm.isDisabled"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否默认主题" prop="isDef">
                                <Input type="text" v-model="updateForm.isDef"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="是否限制微信" prop="limitWeixin">
                                <Input type="text" v-model="updateForm.limitWeixin"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="限定微信投票每个用户每日投票次数,为0时则投票期内限定投票一次" prop="voteDay">
                                <Input type="text" v-model="updateForm.voteDay"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="班级" prop="classId">
                                <Input type="text" v-model="updateForm.classId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="教师" prop="teacher">
                                <Input type="text" v-model="updateForm.teacher"/>
                            </FormItem>
                            </Col>
                    </Row>

            </Form>
        </Modal>


        <Modal
        v-model="voteResultModal"
        :title="'调查结果'"
        :mask-closable="true"
        :loading="loading"
        @on-ok="submitVote"
        @on-cancel="cancel"
        ok-text="提交问卷调查"
        width="80%">
          <Table :loading="tableLoding" border :columns="columns2" :data="voteRecordList"></Table>
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
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '总投票数',
                        key: 'totalCount'
                    },
                  {
                    title: '班级',
                    key: 'classId',
                    render: (h, params) => {
                      return h('div', [
                        h('strong', params.row.classes.name+"_"+params.row.classes.type)
                      ]);
                    }
                  },
                  {
                    title: '教师',
                    key: 'teacherName'
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
                              let votetopicId = params.row.id;
                              this.queryVoteRecordList(votetopicId);
                              this.queryVoteSubTopicList(votetopicId);


                              this.voteResultModal = true;
                            }
                          }
                        }, '调查结果')
                      ]);
                    }
                  }
                ],
                columns2: [
                  {
                    title: '学员',
                    key: 'stuName'
                  }
                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        id:"",
                        siteId:"",
                        title:"",
                        description:"",
                        startTime:"",
                        endTime:"",
                        repeateHour:"",
                        totalCount:"",
                        multiSelect:"",
                        isRestrictMember:"",
                        isRestrictIp:"",
                        isRestrictCookie:"",
                        isDisabled:"",
                        isDef:"",
                        limitWeixin:"",
                        voteDay:"",
                        classId:"",
                        teacher:""
                },
                addForm: {
                        title:"",
                        description:"",
                        classes:{
                          id:""
                        },
                        teacher:{
                          id:""
                        },
                        voteSubtopicList:[],
                        items: [
                          {
                            value: '',
                            index: 1,
                            status: 1
                          }
                        ]
                },
                formRule: {
                    votetopicId: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    siteId: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    title: [
                        {required: true, message:'标题不能为空',trigger:'blur'}
                    ]
                    ,
                    description: [
                        {required: true, message:'描述不能为空',trigger:'blur'}
                    ]
                    ,
                    startTime: [
                        {required: true, message:'开始时间不能为空',trigger:'blur'}
                    ]
                    ,
                    endTime: [
                        {required: true, message:'结束时间不能为空',trigger:'blur'}
                    ]
                    ,
                    repeateHour: [
                        {required: true, message:'重复投票限制时间，单位小时，为空不允许重复投票不能为空',trigger:'blur'}
                    ]
                    ,
                    totalCount: [
                        {required: true, message:'总投票数不能为空',trigger:'blur'}
                    ]
                    ,
                    multiSelect: [
                        {required: true, message:'最多可以选择几项不能为空',trigger:'blur'}
                    ]
                    ,
                    isRestrictMember: [
                        {required: true, message:'是否限制会员不能为空',trigger:'blur'}
                    ]
                    ,
                    isRestrictIp: [
                        {required: true, message:'是否限制IP不能为空',trigger:'blur'}
                    ]
                    ,
                    isRestrictCookie: [
                        {required: true, message:'是否限制COOKIE不能为空',trigger:'blur'}
                    ]
                    ,
                    isDisabled: [
                        {required: true, message:'是否禁用不能为空',trigger:'blur'}
                    ]
                    ,
                    isDef: [
                        {required: true, message:'是否默认主题不能为空',trigger:'blur'}
                    ]
                    ,
                    limitWeixin: [
                        {required: true, message:'是否限制微信不能为空',trigger:'blur'}
                    ]
                    ,
                    voteDay: [
                        {required: true, message:'限定微信投票每个用户每日投票次数,为0时则投票期内限定投票一次不能为空',trigger:'blur'}
                    ]
                    ,
                    "classes.id": [
                        {required: true, message:'班级不能为空',trigger:'blur'}
                    ]
                    ,
                    "teacher.id": [
                        {required: true, message:'教师不能为空',trigger:'blur'}
                    ]
                },
                voteResultModal:false,
                //调查记录
                voteRecordList:[],
                //调查项
                voteSubTopicList:[],
                classesList:[],
                teacherList:[],
                index: 1
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
            addVoteTopic(){
                // this.index = 1;
                this.addModal = true;
                // this.addForm.items.splice(0,this.addForm.items.length);
              //   this.$refs['addForm'].resetFields();
              // this.addForm.items.push({
              //   value: '',
              //   index: 1,
              //   status: 1
              // })
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const voteTopic = this.addForm;


                        this.addForm.items.forEach(item=>{
                          if(item.status===1)
                          {
                            voteTopic.voteSubtopicList.push({
                              title:item.value,
                              priority:item.index,
                              subtopicType:3
                            })
                          }
                        })

                        // delete voteTopic.items;
                        voteTopic.teacherId = voteTopic.teacher.id;
                        axios.request({
                            url: '/api/voteTopic',
                            method: 'post',
                            data: voteTopic
                        }).then((result) => {

                            this.addModal = false;

                            this.gopage(this.pageNo);

                            this.$Message.success('操作成功!');

                            this.$refs['addForm'].resetFields();
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
                            url: '/api/voteTopic',
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
                        url: '/api/voteTopic',
                        method: 'delete',
                        data: this.groupId
                    }).then((result) => {
                        if (result.data.code === 1) {
                            this.$Message.success('操作成功!');
                            this.gopage(this.pageNo);
                        }
                    }).catch((result)=>{
                        this.$Message.error("哦豁，操作异常：已经参与调查后不可以被删除!"+result);
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
                    url: '/api/voteTopic',
                    method: 'get',
                    params: {pageNo, pageSize,keyWord}
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
            queryVoteRecordList(votetopicId){
              axios.request({
                url: '/api/voteRecord/all/'+votetopicId,
                method: 'get'
              }).then((result) => {
                this.voteRecordList = result.data.data;
              }).catch((result)=>{
                this.$Message.error("哦豁，操作异常："+result);
              });
            },
            queryVoteSubTopicList(votetopicId){
              axios.request({
                url: '/api/voteSubtopic/all/'+votetopicId,
                method: 'get'
              }).then((result) => {
                this.voteSubTopicList = result.data.data;

                this.columns2=[
                  {
                    title: '学员',
                    key: 'stuName'
                  }
                ];
                //拼接表头
                let i = 0;
                this.voteSubTopicList.forEach(subTopic=>{
                  this.columns2.push({
                    title: subTopic.title,
                    key: subTopic.id,
                    render: (h, params) => {
                      if(i>=this.voteSubTopicList.length)
                      {
                        i=0;
                      }
                      return h('div', [
                        h('strong',params.row.voteReplyList[i++].reply )
                      ]);
                    }
                  })
                })
              }).catch((result)=>{
                this.$Message.error("哦豁，操作异常："+result);
              });
            },
            handleAdd () {
              this.index++;
              this.addForm.items.push({
                value: '',
                index: this.index,
                status: 1
              });
            },
            handleRemove (index) {
              this.addForm.items[index].status = 0;
            }
        },
        created: function () {

            this.gopage(this.pageNo);

            axios.request({
              url: '/api/classes/all',
              method: 'get'
            }).then((result) => {
              this.classesList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });

            axios.request({
              url: '/api/user/teachers',
              method: 'get'
            }).then((result) => {
              this.teacherList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("哦豁，操作异常："+result);
            });
        }
    }


</script>
