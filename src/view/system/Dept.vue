<template>
    <div>
        <Card>
            <Row>
                部门名字：
                <Input v-model="deptName" placeholder="Enter something..."  style="width: 200px"></Input>
                <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">Search</Button>
            </Row>
            <br>
            <Row>
                <Button type="primary" icon="plus" @click="addDeptUI">新增</Button>
                <Button type="success" icon="ios-build" @click="updateDeptUI">修改</Button>
                <Button type="error" icon="ios-trash" @click="deleteDept">删除</Button>
            </Row>
            <br>
            <Row>
                <Table border ref="selection" :columns="columns4" :data="page.list" @on-selection-change="recordIds"></Table>
            </Row>
            <br>
            <Row>
                <Page :total="page.totalCount" :page-size="page.pageSize" align="center" @on-change="gopage" show-total></Page>
            </Row>

            <!--新建对话框-->
            <Modal
                    v-model="addModel"
                    title="新建部门"
                    @on-ok="addDept"
                    :loading="loading"
                    @on-cancel="cancel">

                <Form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80">
                    <FormItem label="部门名字" prop="deptName">
                        <Input v-model="addForm.deptName" placeholder="输入部门名字..."></Input>
                    </FormItem>
                </Form>

            </Modal>
            <!--修改对话框-->
            <Modal
                    v-model="updateModel"
                    title="修改部门"
                    @on-ok="updateDept"
                    :loading="loading"
                    @on-cancel="cancel">

                <Form ref="updateForm" :model="updateForm" :rules="ruleValidate" :label-width="80">
                    <FormItem label="部门名字" prop="deptName">
                        <Input v-model="updateForm.deptName" placeholder="输入部门名字..."></Input>
                    </FormItem>
                    <FormItem label="状态" prop="state">
                        <RadioGroup v-model="updateForm.state" type="button">
                            <Radio label="1">可用</Radio>
                            <Radio label="0">不可用</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>

            </Modal>
        </Card>
    </div>
</template>

<script>

import axios from '@/libs/api.request'
export default {
    data () {
        return {
            //查询条件
            deptName:'',
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '部门名字',
                    key: 'deptName'
                },
                {
                    title: '状态',
                    key: 'state',
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.state==1?"可用":"不可用")
                        ]);
                    }
                }
            ],
            page:null,
            addModel:false,
            updateModel:false,
            //新增部门表单
            addForm:{
                deptName:"",
                state:1
            },
            //修改部门表单
            updateForm:{
                deptName:"",
                state:1
            },
            //表单校验规则
            ruleValidate: {
                deptName: [
                    { required: true, message: '部门名称不能为空', trigger: 'blur' }
                ]
            },
            //true:由我们自己控制是否关闭
            loading:true,
            //用于记录选中的记录id
            ids:[]
        };
    },
    methods: {
        gopage:function (pageNo) {
            // alert(pageNo);
            axios.request({
                url:"/system/dept",
                method:"get",
                params:{
                    pageNo:pageNo,
                    pageSize:5,
                    deptName:this.deptName
                }
            }).then((resp) => {
                //给data1模型数据赋值
                this.page = resp.data.data;
            })
        },
        addDeptUI:function () {
            //弹出addModel对话框
            this.addModel=true;
        },
        addDept:function () {

            //判断表单是否验证通过
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    //发送ajax保存部门数据
                    axios.request({
                        url: '/system/dept',
                        method: 'post',
                        data:this.addForm
                    }).then((resp)=>{
                        if(resp.data.code === 1)
                        {
                            this.$Message.success("新增部门成功");
                            //手动关闭对话框
                            this.addModel = false;
                        }
                        else
                        {
                            this.$Message.error("新增部门失败");
                        }
                    })
                } else {

                    setTimeout( () =>{
                        this.loading = false;
                        //当下一次dom刷新后，又将loading改为true
                        this.$nextTick(()=>{
                            this.loading = true;
                        })
                    },1000);

                }
            })



        },
        updateDeptUI:function () {
            //判断当前选中几条数据
            if(this.ids.length==1)
            {
                //显示修改对话框
                this.updateModel = true;
            }
            else
            {
                this.$Message.warning("只能修改一条数据");
            }
        },
        //记录选中的数据主键
        recordIds:function (selection) {
            //清空一下ids
            this.ids = [];
            //循环遍历,将selection中的id存入模型数据ids
            for(let i = 0 ; i< selection.length;i++)
            {
                this.ids.push(selection[i].id);
            }
            //如果选中数量为 1，将当前选中的数据赋给updateForm
            if(this.ids.length == 1)
            {
                this.updateForm = selection[0];
            }
        },
        updateDept:function () {
            //判断表单是否验证通过
            this.$refs['updateForm'].validate((valid) => {
                if (valid) {
                    //发送ajax保存部门数据
                    axios({
                        url: '/system/dept',
                        method: 'put',
                        data:this.updateForm
                    }).then((resp)=>{
                        if(resp.data.code === 1)
                        {
                            this.$Message.success("修改部门成功");
                            //手动关闭对话框
                            this.updateModel = false;

                            //刷新数据
                            this.gopage(this.page.pageNo);
                        }
                        else
                        {
                            this.$Message.error("修改部门失败");
                        }
                    })
                } else {

                    setTimeout( () =>{
                        this.loading = false;
                        //当下一次dom刷新后，又将loading改为true
                        this.$nextTick(()=>{
                            this.loading = true;
                        })
                    },1000);

                }
            })
        },
        deleteDept:function () {
            //判断至少选中一条数据
            if(this.ids.length>0)
            {
                axios.request({
                    url:"system/dept",
                    method:"delete",
                    data:this.ids
                }).then((resp)=>{
                    if(resp.data.code === 1)
                    {
                        this.$Message.success("删除成功");
                        this.gopage(this.page.pageNo);
                    }
                    else
                    {
                        this.$Message.error("删除失败");
                    }
                })
            }
            else
            {
                this.$Message.warning("请至少选中一条数据");
            }
        }
    },
    created:function () {
        //初始化第一页数据
        this.gopage(this.pageNo);
    }
};
</script>

<style>

</style>
