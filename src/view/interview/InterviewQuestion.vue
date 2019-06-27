<template>
    <Card>
        <Row>
            <Col span="8">
                <Input v-model="keyWord" placeholder="请输入学员信息跟踪..." style="width:200px"/>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage()">搜索</Button>
            </Col>
        </Row>
        <br>
        <Row>
                    <Button type="primary" icon="ios-add" @click="addInterviewQuestion()">新建</Button>
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
                            <FormItem label="" prop="id">
                                <Input type="text" v-model="addForm.id"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="题目" prop="title">
                                <Input type="text" v-model="addForm.title"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="课程" prop="courseId">
                                <Input type="text" v-model="addForm.courseId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="知识点" prop="knowledgePointId">
                                <Input type="text" v-model="addForm.knowledgePointId"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                        <!-- 循环便利row中的两个元素-->
                            <Col span="11">
                            <FormItem label="答案" prop="answer">
                                <Input type="text" v-model="addForm.answer"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="所属面试" prop="interiewId">
                                <Input type="text" v-model="addForm.interiewId"/>
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

                    <Row>
                            <Col span="11">
                            <FormItem label="" prop="id">
                                <Input type="text" v-model="updateForm.id"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="题目" prop="title">
                                <Input type="text" v-model="updateForm.title"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="课程" prop="courseId">
                                <Input type="text" v-model="updateForm.courseId"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="知识点" prop="knowledgePointId">
                                <Input type="text" v-model="updateForm.knowledgePointId"/>
                            </FormItem>
                            </Col>
                    </Row>
                    <Row>
                            <Col span="11">
                            <FormItem label="答案" prop="answer">
                                <Input type="text" v-model="updateForm.answer"/>
                            </FormItem>
                            </Col>
                                <Col span="2" style="text-align: center"/>
                            <Col span="11">
                            <FormItem label="所属面试" prop="interiewId">
                                <Input type="text" v-model="updateForm.interiewId"/>
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
                        title: '题目',
                        key: 'title'
                    },
                    {
                        title: '课程',
                        key: 'courseId'
                    },
                    {
                        title: '知识点',
                        key: 'knowledgePointId'
                    },
                    {
                        title: '答案',
                        key: 'answer'
                    },
                    {
                        title: '所属面试',
                        key: 'interiewId'
                    }
                ],
                self: this,
                page: [],
                updateModal: false,
                addModal: false,
                updateForm: {
                        id:"",
                        title:"",
                        courseId:"",
                        knowledgePointId:"",
                        answer:"",
                        interiewId:""
                },
                addForm: {
                        title:"",
                        courseId:"",
                        knowledgePointId:"",
                        answer:"",
                        interiewId:""
                },
                formRule: {
                    id: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
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
            addInterviewQuestion(){
                this.addModal = true;
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
                            url: '/api/interviewQuestion',
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
                        url: '/api/interviewQuestion',
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
                    url: '/api/interviewQuestion',
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
