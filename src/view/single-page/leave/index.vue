<template>
    <Card>
        <!--<Row>-->
            <!--<Col span="8">-->
                <!--<Input v-model="keyWord" placeholder="请输入请假..." style="width:200px"/>-->
                <!--<Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<br>-->
        <Row>
                    <Button type="primary" icon="ios-add" @click="addLeave()">新建</Button>
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
                title="添加请假"
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
                              <FormItem label="起始日期" prop="startDate">
                                <DatePicker type="daterange" @on-change="chooseDate"  placement="bottom-end" placeholder="选择起始日期" style="width: 200px"></DatePicker>
                              </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center"/>
                            <Col span="11">
                              <FormItem label="天数">
                                <Input type="text" v-model="addForm.totalDay"/>
                              </FormItem>
                            </Col>
                    </Row>
                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="22">
                        <FormItem label="审批老师" prop="reviewer">
                          <Select v-model="addForm.reviewer" style="width:200px">
                            <Option v-for="item in teacherList" :value="item.userName" :key="item.userName">{{ item.userInfo.name }}</Option>
                          </Select>
                        </FormItem>
                      </Col>

                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="22">
                              <FormItem label="原因" prop="reason">
                                <Input type="textarea" v-model="addForm.reason"/>
                              </FormItem>
                            </Col>

                    </Row>

            </Form>
        </Modal>


        <Modal
                v-model="imgModal"
                title="流程进度跟踪"
                :mask-closable="false"
                :loading="loading"
                @on-cancel="cancel"
                width="60%">
            <Form ref="imgForm" :label-width="80">

                    <Row>
                            <Col span="22">
                            <FormItem label="" prop="id">
                                <img :src="img" />
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
    import { setToken, getToken } from '@/libs/util'
    import axios from '@/libs/api.request'
    import config from '@/config'
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

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
                        title: '开始日期',
                        key: 'startDate'
                    },
                    {
                        title: '结束日期',
                        key: 'endDate'
                    },
                    {
                        title: '天数',
                        key: 'totalDay'
                    },
                    {
                        title: '原因',
                        key: 'reason'
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
                              this.img = baseUrl+"api/leave/read-img/"+params.row.processInstanceId+"?access_token="+getToken()+"&time="+new Date();
                              //加载历史备注
                              this.imgModal = true;
                            }
                          }
                        }, '流程跟踪')
                      ]);
                    }
                  }


                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        id:"",
                        startDate:"",
                        endDate:"",
                        totalDay:"",
                        reason:"",
                        taskId:"",
                },
                addForm: {
                        startDate:"",
                        endDate:"",
                        totalDay:"",
                        reason:"",
                        taskId:"",
                        reviewer:""
                },
                formRule: {
                    startDate: [
                        {required: true, message:'开始日期不能为空',trigger:'blur'}
                    ]
                    ,
                    endDate: [
                        {required: true, message:'结束日期不能为空',trigger:'blur'}
                    ]
                    ,
                    totalDay: [
                        {required: true, message:'天数不能为空',trigger:'blur'}
                    ]
                    ,
                    reason: [
                        {required: true, message:'原因不能为空',trigger:'blur'}
                    ]

                },
                teacherList: [

                ],
                imgModal:false,
                img:''
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
            addLeave(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const leave = this.addForm;
                        axios.request({
                            url: '/api/leave',
                            method: 'post',
                            data: leave
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
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        axios.request({
                            url: '/api/leave',
                            method: 'put',
                            data: this.updateForm
                        }).then((result) => {
                            this.updateModal = false,
                                    this.$Message.success('操作成功!');
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
                        url: '/api/leave',
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
                                this.tableLoding=true;
                this.pageNo = pageNo;
                const pageSize = this.pageSize;
                const keyWord = this.keyWord;
                axios.request({
                    url: '/api/leave',
                    method: 'get',
                    params: {pageNo, pageSize,keyWord}
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
            chooseDate(e1){
              this.addForm.startDate = e1[0];
              this.addForm.endDate = e1[1];
              console.log(datedifference(e1[0],e1[1]));
              this.addForm.totalDay = datedifference(e1[0],e1[1])+1;
            }
        },
        mounted: function () {
            this.gopage(this.pageNo);

            axios.request({
              url: '/api/user/teachers',
              method: 'get'
            }).then((result) => {
              this.teacherList = result.data.data;
            }).catch((result)=>{
              this.$Message.error("操作异常："+result);
            });
        }
    }
//两个时间相差天数 兼容firefox chrome
function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
  let dateSpan,
    iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};

</script>
