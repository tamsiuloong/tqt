<template>
    <div class="animated fadeIn">
        <Card>
            <Row>
                <Col span="24">
                    模块：<Input v-model="keyWord" placeholder="请输入..." style="width:200px"/>
                  <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
                </Col>
            </Row>
            <br>
            <Row>
                <Button type="primary" iicon="ios-add" @click="addModule()">新建</Button>
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
                    v-model="updateModal"
                    title="编辑模块"
                    @on-ok="update"
                    @on-cancel="cancel" width="80%" :loading="loading">
                <Form ref="updateForm" :model="dataForm" :rules="formRule" :label-width="80">
                    <Row>

                        <Col span="14">
                            <FormItem label="等级" prop="ctype" >
                                <RadioGroup v-model="dataForm.ctype" @on-change="changeCType" >
                                    <Radio label="0">一级菜单</Radio>
                                    <Radio label="1">二级菜单</Radio>
                                    <!--<Radio label="2">按钮</Radio>-->
                                    <!--<Radio label="3">链接</Radio>-->
                                    <!--<Radio label="4">状态</Radio>-->
                                </RadioGroup>
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="父模块" prop="parentId" >
                                <Select v-model="dataForm.parentId" filterable>
                                    <Option v-for="item in moduleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="模块名" prop="name" >
                                <Input type="text" v-model="dataForm.name"/>
                            </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="权限标识" prop="cpermission" >
                          <Input type="text" v-model="dataForm.cpermission"/>
                        </FormItem>
                      </Col>
                        <!--<Col span="11">-->
                            <!--<FormItem label="层数"  >-->
                                <!--<Input type="text" v-model="dataForm.layerNum"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                    <!--<Row>-->
                        <!--&lt;!&ndash;<Col span="11">&ndash;&gt;-->
                            <!--&lt;!&ndash;<FormItem label="权限标识" prop="cpermission" >&ndash;&gt;-->
                                <!--&lt;!&ndash;<Input type="text" v-model="dataForm.cpermission"/>&ndash;&gt;-->
                            <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                        <!--&lt;!&ndash;<Col span="2" style="text-align: center"/>&ndash;&gt;-->
                        <!--&lt;!&ndash;<Col span="11">&ndash;&gt;-->
                            <!--&lt;!&ndash;<FormItem label="链接" prop="curl" >&ndash;&gt;-->
                                <!--&lt;!&ndash;<Input type="text" v-model="dataForm.curl"/>&ndash;&gt;-->
                            <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                        <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                    <!--</Row>-->

                  <Row>
                    <Col span="11">
                      <FormItem label="状态" prop="state" >
                        <Radio-group v-model="dataForm.state" type="button">
                          <Radio label="1" >启用</Radio>
                          <Radio label="0">停用</Radio>
                        </Radio-group>
                      </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center"/>
                    <Col span="11">
                      <FormItem label="说明" prop="remark" >
                        <Input type="textarea" v-model="dataForm.remark"/>
                      </FormItem>
                    </Col>
                  </Row>

                    <!--<Row>-->
                        <!--<Col span="11">-->
                            <!--<FormItem label="排序号" prop="orderNo" >-->
                                <!--<Input type="text" v-model="dataForm.orderNo"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="2" style="text-align: center"/>-->
                        <!---->
                    <!--</Row>-->

                </Form>
            </Modal>
            <Modal
                    v-model="addModal"
                    title="添加模块"
                    @on-ok="add"
                    @on-cancel="cancel" width="80%" :loading="loading">
                <Form ref="addForm" :model="dataForm" :rules="formRule" :label-width="80">
                    <Row>

                        <Col span="14">
                            <FormItem label="等级" prop="ctype" >
                                <RadioGroup v-model="dataForm.ctype" @on-change="changeCType" >
                                  <Radio label="0">一级菜单</Radio>
                                  <Radio label="1">二级菜单</Radio>
                                    <!--<Radio label="2">按钮</Radio>-->
                                    <!--<Radio label="3">链接</Radio>-->
                                    <!--<Radio label="4">状态</Radio>-->
                                </RadioGroup>
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="父模块" prop="parentId" >
                                <Select v-model="dataForm.parentId" filterable>
                                    <Option v-for="item in moduleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="模块名" prop="name" >
                                <Input type="text" v-model="dataForm.name"/>
                            </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="权限标识" prop="cpermission" >
                          <Input type="text" v-model="dataForm.cpermission"/>
                        </FormItem>
                      </Col>
                        <!--<Col span="11">-->
                            <!--<FormItem label="层数" >-->
                                <!--<Input type="text" readonly v-model="dataForm.layerNum"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                    <!--<Row>-->
                        <!--<Col span="11">-->
                            <!--<FormItem label="权限标识" prop="cpermission" >-->
                                <!--<Input type="text" v-model="dataForm.cpermission"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="2" style="text-align: center"/>-->
                        <!--<Col span="11">-->
                            <!--<FormItem label="链接" prop="curl" >-->
                                <!--<Input type="text" v-model="dataForm.curl"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                    <!--</Row>-->

                    <Row>
                      <Col span="11">
                        <FormItem label="状态" prop="state" >
                          <Radio-group v-model="dataForm.state" type="button">
                            <Radio label="1" >启用</Radio>
                            <Radio label="0">停用</Radio>
                          </Radio-group>
                        </FormItem>
                      </Col>
                      <Col span="2" style="text-align: center"/>
                      <Col span="11">
                        <FormItem label="说明" prop="remark" >
                          <Input type="textarea" v-model="dataForm.remark"/>
                        </FormItem>
                      </Col>
                    </Row>


                    <!--<Row>-->
                        <!--<Col span="11">-->

                            <!--<FormItem label="排序号" prop="orderNo" >-->
                                <!--<Input type="text" v-model="dataForm.orderNo"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                        <!--<Col span="2" style="text-align: center"/>-->
                        <!--<Col span="11">-->
                            <!--<FormItem label="说明" prop="remark" >-->
                                <!--<Input type="textarea" v-model="dataForm.remark"/>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                    <!--</Row>-->

                </Form>
            </Modal>
        </Card>
</div>
</template>

<script type="text/ecmascript-6">
    import axios from '@/libs/api.request'
    export default {
        data() {
            return {
                tableLoding:true,
                loading:true,
                count: 0,
                groupId: null,
                keyWord:"",
                totalCount:0,
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '模块名',
                        key: 'name'
                    },
                    // {
                    //     title: '层数',
                    //     key: 'layerNum'
                    // },
                    {
                        title: '权限标识',
                        key: 'cpermission'
                    },
                    // {
                    //     title: '链接',
                    //     key: 'curl'
                    // },
                    {
                        title: '类型',
                        key: 'ctype',
                        filters: [
                            {
                                label: '一级菜单',
                                value: 0
                            },
                            {
                                label: '二级菜单',
                                value: 1
                            }
                            // ,
                            // {
                            //     label: '按钮',
                            //     value: 2
                            // },
                            // {
                            //     label: '链接',
                            //     value: 3
                            // },
                            // {
                            //     label: '状态',
                            //     value: 4
                            // }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 0) {
                                return row.ctype===0;
                            } else if (value === 1) {
                                return row.ctype===1;
                            }else if (value === 2) {
                                return row.ctype===2;
                            }else if (value === 3) {
                                return row.ctype===3;
                            }else if (value === 4) {
                                return row.ctype===4;
                            }
                        },
                        render: (h, params) => {
                            const task_status=parseInt(params.row.ctype);

                            if(task_status===0)
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: "primary"
                                        }
                                    }, "一级菜单"),
                                ]);

                            else if(task_status===1)
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: "success"
                                        }
                                    }, "二级菜单"),
                                ]);

                        }
                    },
                    {
                        title: '状态',
                        ellipsis:'true',
                        key:'state',
                        filters: [
                            {
                                label: '启用',
                                value: 1
                            },
                            {
                                label: '禁用',
                                value: 0
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.state===1;
                            } else if (value === 0) {
                                return row.state===0;
                            }
                        },
                        render: (h, params) => {
                            const task_status=parseInt(params.row.state);

                            if(task_status===1)
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: "green"
                                        }
                                    }, "启用"),
                                ]);

                            else if(task_status===0)
                                return h('div', [
                                    h('Tag', {
                                        props: {
                                            color: "red"
                                        }
                                    }, "禁用"),
                                ]);
                        }
                    }
                ],
                self: this,
                page: {
                  size:20,
                  number:1
                },
                updateModal: false,
                addModal: false,
                dataForm: {
                    "name":"",
                    "moduleName": "",
                    "layerNum": "1",
                    "cpermission": "",
                    "curl": "",
                    "ctype": "0",
                    "state": "1",
                    "remark": "",
                    "orderNo": "",
                    "parentId": ""
                },
                formRule: {
                    name: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    layerNum: [
                        {required: true, message:'层数不能为空',trigger:'blur'}
                    ]
                    ,
                    isLeaf: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    ico: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    cpermission: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    curl: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    ctype: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    state: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    belong: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    cwhich: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    remark: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                    ,
                    orderNo: [
                        {required: true, message:'不能为空',trigger:'blur'}
                    ]
                },
                moduleList:{},
                degreeList:[
                    {
                        value: '0',
                        label: '超级管理员'
                    },
                    {
                        value: '1',
                        label: '跨部门跨人员'
                    },
                    {
                        value: '2',
                        label: '管理所有下属部门和人员'
                    },
                    {
                        value: '3',
                        label: '管理本部门'
                    },
                    {
                        value: '4',
                        label: '普通员工'
                    }
                ]
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
            addModule(){
                this.addModal=true;
            },
            add(){
                const dataForm = this.dataForm;
                this.$refs['addForm'].validate((valid)=>{
                    if(valid)
                    {
                        axios.request({
                            url: '/api/module',
                            method: 'post',
                            data:dataForm
                        }).then((result) => {

                            this.$refs['addForm'].resetFields();
                            this.addModal=false;
                            this.gopage(this.page.number);
                            this.$Message.success('操作成功!');
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
            changeCType(type){
                this.dataForm.layerNum = parseInt(type)+1;

                axios.request({
                    url: '/api/module/getParent/'+type,
                    method: 'get'
                }).then((result) => {
                    this.moduleList=result.data.data;
                });
            },
            edit (index) {

                if (this.count != 1) {
                    this.updateModal = false;
                    this.$Message.warning('请至少并只能选择一项');
                }
                else {
                    this.updateModal = true;
                    var editModule =this.updateForm;

                    this.dataForm = editModule;
//radio组件lavle接受字符串，因此自己转换一下 int -> string
                    this.dataForm.ctype=editModule.ctype+"";
                    this.dataForm.state=editModule.state+"";
//初始化父菜单列表
                    this.changeCType(editModule.ctype);
                }



            },
            remove () {

                axios.request({
                    url: '/api/module',
                    method: 'delete',
                    data:this.groupId
                }).then((result) => {
                    if(result.data.code === 1)
                    {
                        this.$Message.success('操作成功!');
                        this.gopage(this.page.number);
                    }
                });
            },
            ok () {
                this.updateModal = false,
                    this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            update () {
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid)
                    {
                        const dataForm = this.dataForm;
                        axios.request({
                            url: '/api/module',
                            method: 'put',
                            data:dataForm
                        }).then((result) => {
                            this.updateModal=false;
                            this.gopage(this.page.number);
                            this.$Message.success('操作成功!');
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
            handleReset (moduleName) {
                this.$refs[moduleName].resetFields();
            },
            gopage(pageNo){
                this.tableLoding=true;
                const pageSize = this.page.size;
                axios.request({
                    url: '/api/module',
                    method: 'get',
                    params:{pageNo,pageSize}
                }).then((result) => {
                    this.page=result.data.data;
                    this.tableLoding=false;
                });
            }
        },
        created:function(){
            this.gopage(1);
        }
    }
</script>
