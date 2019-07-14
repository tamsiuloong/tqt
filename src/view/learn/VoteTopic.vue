<template>
    <Card>
        <!--<Row>-->
            <!--<Col span="12">-->
                <!--<Input v-model="keyWord" placeholder="请输入投票主题..." style="width:200px"/>-->
                <!--<Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<br>-->
        <Row>
                    <!--<Button type="primary" icon="ios-add" @click="addVoteTopic()">新建</Button>-->
                    <!--<Button type="success" icon="ios-build" @click="edit()">修改</Button>-->
                    <!--<Button type="error" icon="ios-trash" @click="remove()">删除</Button>-->
        </Row>
        <br>
        <Row>
                        <Table border :columns="columns1" :data="page.content" @on-selection-change="change"></Table>
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
                            <FormItem label="" prop="votetopicId">
                                <Input type="text" v-model="addForm.votetopicId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="" prop="siteId">
                                <Input type="text" v-model="addForm.siteId"/>
                            </FormItem>
                            </Col>
                    </Row>
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
                            <FormItem label="开始时间" prop="startTime">
                                <Input type="text" v-model="addForm.startTime"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="结束时间" prop="endTime">
                                <Input type="text" v-model="addForm.endTime"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="重复投票限制时间，单位小时，为空不允许重复投票" prop="repeateHour">
                                <Input type="text" v-model="addForm.repeateHour"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="总投票数" prop="totalCount">
                                <Input type="text" v-model="addForm.totalCount"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="最多可以选择几项" prop="multiSelect">
                                <Input type="text" v-model="addForm.multiSelect"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否限制会员" prop="isRestrictMember">
                                <Input type="text" v-model="addForm.isRestrictMember"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="是否限制IP" prop="isRestrictIp">
                                <Input type="text" v-model="addForm.isRestrictIp"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否限制COOKIE" prop="isRestrictCookie">
                                <Input type="text" v-model="addForm.isRestrictCookie"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="是否禁用" prop="isDisabled">
                                <Input type="text" v-model="addForm.isDisabled"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="是否默认主题" prop="isDef">
                                <Input type="text" v-model="addForm.isDef"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="是否限制微信" prop="limitWeixin">
                                <Input type="text" v-model="addForm.limitWeixin"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="限定微信投票每个用户每日投票次数,为0时则投票期内限定投票一次" prop="voteDay">
                                <Input type="text" v-model="addForm.voteDay"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="班级" prop="classId">
                                <Input type="text" v-model="addForm.classId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="教师" prop="teacher">
                                <Input type="text" v-model="addForm.teacher"/>
                            </FormItem>
                            </Col>
                    </Row>
            </Form>
        </Modal>


        <Modal
                v-model="joinVoteModal"
                :title="joinVoteForm.title"
                :mask-closable="false"
                :loading="loading"
                @on-ok="submitVote"
                @on-cancel="cancel"
                ok-text="提交问卷调查"
                width="80%">
            <Form ref="joinVoteForm" :model="joinVoteForm" :rules="formRule" :label-width="80">

                    <Row>
                      <Col span="24">
                       <h2 style="color: red">注意：各个评分项分值范围为1-100分</h2>
                      </Col>
                    </Row>
                    <br>
                    <Row v-for="(v,i) in voteSubTopicList" :key="i">
                          <Col span="8">
                           {{v.title}}
                          </Col>
                          <Col span="3"  v-if="v.title!='建议'" >
                              <Input type="number" maxlength="3" size="small" number="true" @on-blur="validNumber($event,i)"  v-model="voteReply[i]"/>
                          </Col>

                          <Col span="16" v-else>
                            <Input type="textarea" v-model="voteReply[i]"/>
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
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '描述',
                        key: 'description'
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
                                this.queryVoteSubTopicList(votetopicId);
                                //初始化调查回复
                                this.voteReply=[];
                                // this.voteSubTopicList.forEach(subTopic=>{
                                //   this.voteReply.push({
                                //     subtopicId:subTopic.id,
                                //     reply:""
                                //   })
                                // })
                                this.joinVoteForm = params.row;
                                this.joinVoteModal = true;
                              }
                            }
                          }, '参与调查')
                        ]);
                      }
                    }
                ],
                self: this,
                page: [],
                joinVoteModal: false,
                addModal: false,
                joinVoteForm: {
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
                    classId: [
                        {required: true, message:'班级不能为空',trigger:'blur'}
                    ]
                    ,
                    teacher: [
                        {required: true, message:'教师不能为空',trigger:'blur'}
                    ]
                },
                voteSubTopicList:[],
                voteReply:[],
                beginTime:{},
                endTime:{}
            }
        },
        methods: {
            change(e){
                this.count = e.length;
                if (e.length == 1) {
                    this.joinVoteForm = e[0];
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
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const voteTopic = this.addForm;
                        axios.request({
                            url: '/api/voteTopic',
                            method: 'post',
                            data: voteTopic
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
                    this.joinVoteModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
                    this.joinVoteModal = true;
                }
            },
            //提交问卷调查
            submitVote () {
                if(this.voteReply.length!=this.voteSubTopicList.length)
                {
                  this.$Message.error("这位童鞋，还没有填写完哦!");
                  setTimeout(()=>{
                    this.loading=false;
                    this.$nextTick(()=>{
                      this.loading=true;
                    });
                  },1000);
                }
                else {
                  //提交数据前，先转换数据 str->reply对象
                  for(let i = 0 ;i < this.voteReply.length;i++)
                  {
                    this.voteReply[i]={
                      subtopicId:this.voteSubTopicList[i].id,
                      reply:this.voteReply[i]
                    }
                  }

                  axios.request({
                    url: '/api/voteReply',
                    method: 'post',
                    data: this.voteReply,
                    params:{
                      voteTopicId:this.joinVoteForm.id
                    }
                  }).then((result) => {
                    if(result.data.code===0)
                    {
                      this.$Message.error(result.data.data);
                    }
                    else {
                      this.$Message.success('提交成功，感谢你的认真！');
                      this.joinVoteModal = false;
                    }
                  }).catch((result)=>{
                    this.$Message.error(result.response.data.message);
                    setTimeout(()=>{
                      this.loading=false;
                      this.$nextTick(()=>{
                        this.loading=true;
                      });
                    },1000);
                  });
                }
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
                        this.$Message.error("操作异常："+result);
                    });
                } else {
                    this.$Message.warning('请至少选择一项');
                }
            },
            gopage(pageNo){
                this.pageNo = pageNo;
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/voteTopic/mine',
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
            },
            queryVoteSubTopicList(votetopicId){
              axios.request({
                url: '/api/voteSubtopic/all/'+votetopicId,
                method: 'get'
              }).then((result) => {
                this.voteSubTopicList = result.data.data;
              }).catch((result)=>{
                this.$Message.error("操作异常："+result);
              });
            },
            validNumber(event,i){
              let val = event.target.value;
              if(val>0&&val<=100)
              {
                return;
              }
              else
              {
                event.target.value="100";
                this.voteReply[i] = '100'
              }
            }
        },
        mounted: function () {
            this.gopage(this.pageNo);
            //初始化时间
            this.beginTime = new Date();
        }
    }


</script>
