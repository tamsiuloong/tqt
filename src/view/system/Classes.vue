<template>
    <Card>
        <Row>
            <Col span="8">
                <Input v-model="keyWord" placeholder="请输入班级..." style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addClasses()">新建</Button>
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
                        <Page :total="totalCount" :page-size="page.size" :current="page.number+1" @on-change="gopage"
                              align="center"></Page>
        </Row>
        <br>

        <Modal
                v-model="addModal"
                title="添加班级"
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
                              <FormItem label="班级名字" prop="name">
                                  <Input type="text" v-model="addForm.name"/>
                              </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center"/>
                            <Col span="11">
                              <FormItem label="类型" prop="type">
                                <Input type="text" v-model="addForm.type"/>
                              </FormItem>
                            </Col>

                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="开班日期" prop="beginTime">
                              <DatePicker v-model="addForm.beginTime" type="date" placeholder="Select date"
                                          style="width: 200px"></DatePicker>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="结束日期" prop="endTime">
                              <DatePicker v-model="addForm.endTime" type="date" placeholder="Select date"
                                          style="width: 200px"></DatePicker>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="22">
                            <FormItem label="是否毕业" prop="closed">
                                <Radio-group v-model="addForm.closed" type="button">
                                  <Radio label="false">正常</Radio>
                                  <Radio label="true">已毕业</Radio>
                                </Radio-group>
                            </FormItem>
                            </Col>
                    </Row>
            </Form>
        </Modal>


        <Modal
                v-model="updateModal"
                title="编辑班级"
                :mask-closable="false"
                :loading="loading"
                @on-ok="update"
                @on-cancel="cancel"
                width="60%">
            <Form ref="updateForm" :model="updateForm" :rules="formRule" :label-width="80">
                    <Row>
                            <Col span="11">
                            <FormItem label="班级名字" prop="name">
                                <Input type="text" v-model="updateForm.name"/>
                            </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center"/>
                            <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                              <FormItem label="类型" prop="type">
                                <Input type="text" v-model="updateForm.type"/>
                              </FormItem>
                            </Col>

                    </Row>

                    <Row>
                      <!-- 循环便利row中的两个元素-->
                      <Col span="11">
                        <FormItem label="开班日期" prop="beginTime">
                          <DatePicker v-model="updateForm.beginTime" type="date" placeholder="Select date"
                                      style="width: 200px"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="结束日期" prop="endTime">
                          <DatePicker v-model="updateForm.endTime" type="date" placeholder="Select date"
                                      style="width: 200px"></DatePicker>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>

                      <Col span="22">
                        <FormItem label="是否毕业" prop="closed">
                          <Radio-group v-model="updateForm.closed" type="button">
                            <Radio :label="false">正常</Radio>
                            <Radio :label="true">已毕业</Radio>
                          </Radio-group>
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
                        title: '班级名字',
                        key: 'name'
                    },
                    {
                      title: '类型',
                      key: 'type'
                    },
                    {
                        title: '开班日期',
                        key: 'beginTime'
                    },
                    {
                        title: '结束日期',
                        key: 'endTime'
                    },
                    {
                        title: '是否毕业',
                        key: 'closed',
                        render: (h, params) => {
                          return h('div', [
                            h('strong', params.row.closed?"已毕业":"正常")
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
                        name:"",
                        beginTime:"",
                        endTime:"",
                        type:"",
                        closed:"false"
                },
                addForm: {
                        name:"",
                        beginTime:"",
                        endTime:"",
                        type:"",
                        closed:"false"
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    name: [
                        {required: true, message:'班级名字不能为空',trigger:'blur'}
                    ]
                    // ,
                    // beginTime: [
                    //     {required: true, message:'开班日期不能为空',trigger:'blur'}
                    // ]
                    // ,
                    // endTime: [
                    //     {required: true, message:'结束日期不能为空',trigger:'blur'}
                    // ]
                    ,
                    type: [
                        {required: true, message:'类型不能为空',trigger:'blur'}
                    ]
                    ,
                    // closed: [
                    //     {required: true, message:'是否毕业不能为空',trigger:'blur'}
                    // ]
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
            addClasses(){
                this.addModal = true;
            },
            add(){
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        const classes = this.addForm;
                        axios.request({
                            url: '/api/classes',
                            method: 'post',
                            data: classes
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
                }
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        axios.request({
                            url: '/api/classes',
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
                        url: '/api/classes',
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
                    url: '/api/classes',
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
            }
        },
        mounted: function () {
            this.gopage();
        }
    }


</script>
