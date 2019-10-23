<template>
  <Card>
    <div class="animated fadeIn">
      <Row>
        <Col span="6">角色：
          <Input v-model="name" placeholder="请输入..." style="width:200px"/>
        </Col>
        <Col span="8">
          <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)">搜索</Button>
        </Col>
      </Row>
      <br>
      <Row>
        <Button type="primary" iicon="ios-add" @click="addRole()">新建</Button>
        <Button type="success" icon="ios-build" @click="edit()">修改</Button>
        <Button type="error" icon="ios-trash" @click="remove()">删除</Button>
      </Row>
      <br>
      <Row>
        <Table :loading="tableLoding" border :columns="columns1" :data="page.content"
               @on-selection-change="s=>{change(s)}"></Table>
      </Row>
      <br>
      <Row>
        <Page :total="page.totalElements" :page-size="page.size" :current="page.number+1" @on-change="gopage"
              align="center" show-total></Page>
      </Row>

      <Modal
        v-model="addModal"
        title="添加角色"
        :mask-closable="true"
        :loading="loading"
        @on-ok="add"
        @on-cancel="cancel"
        width="80%">
        <Form ref="addForm" :model="addForm" :rules="ruleCustom" :label-width="80">
          <Row>
            <Col span="11">
              <FormItem label="角色名字" prop="name">
                <Input type="text" v-model="addForm.name"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
            <Col span="11">
              <FormItem label="备注" prop="remark">
                <Input type="text" v-model="addForm.remark"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="排序号" prop="orderNo">
                <Input type="text" v-model="addForm.orderNo"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
          </Row>

        </Form>
      </Modal>


      <Modal
        v-model="updateModal"
        title="编辑角色"
        :mask-closable="true"
        :loading="loading"
        @on-ok="update"
        @on-cancel="cancel"
        width="80%">
        <Form ref="updateForm" :model="updateForm" :rules="ruleCustom" :label-width="80">

          <Row>
            <Col span="11">
              <FormItem label="角色名字" prop="name">
                <Input type="text" v-model="updateForm.name"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
            <Col span="11">
              <FormItem label="备注" prop="remark">
                <Input type="text" v-model="updateForm.remark"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="排序号">
                <Input type="text" v-model="updateForm.orderNo"/>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="模块">
                <ul id="treeDemo" class="ztree"></ul>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center"/>
          </Row>

        </Form>
      </Modal>
    </div>
  </Card>
</template>

<script type="text/ecmascript-6">
  import 'ztree/js/jquery-1.4.4.min.js'
  import 'ztree/js/jquery.ztree.core.min.js'
  import 'ztree/js/jquery.ztree.excheck.min.js'
  import 'ztree/css/zTreeStyle/zTreeStyle.css'
  import axios from '@/libs/api.request'

  export default {
    data () {
      return {
        tableLoding: true,
        loading: true,
        count: 0,
        gourpId: null,
        name: '',
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名字',
            key: 'name'
          },
          {
            title: '备注',
            key: 'remark'
          },
          {
            title: '排序号',
            key: 'orderNo'
          }
        ],
        self: this,
        page: {
          size: 20,
          number: 1
        },
        updateModal: false,
        addModal: false,
        updateForm: {
          name: '',
          remark: '',
          orderNo: '',
          moduleIds: []
        },
        addForm: {
          name: '',
          remark: '',
          orderNo: ''
        },
        ruleCustom: {
          name: [
            { required: true, message: '角色名字不能为空', trigger: 'blur' }
          ]
          ,
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
          ,
          orderNo: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ]
        },
        setting: {
          check: {
            enable: true
          },
          data: {
            simpleData: {
              enable: true
            }
          }
        },
        ztreeObj: {},
        zNodes: []
      }
    },
    methods: {
      change (e) {
        if (e.length == 1) {
          this.updateForm = e[0]
        }
        this.setGroupId(e)
      },
      setGroupId (e) {
        this.groupId = []
        this.count = e.length
        for (var i = 0; i < e.length; i++) {
          this.groupId.push(e[i].id)
        }
      },
      reset (form) {
        this.$refs[form].resetFields()
      },
      addRole () {
        this.addModal = true
      },
      add () {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            const role = this.addForm

            axios.request({
              url: '/api/role',
              method: 'post',
              data: role
            }).then((result) => {
              this.gopage(this.page.number)
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
        if (this.count !== 1) {
          this.updateModal = false;
          this.$Message.warning("请至少并只能选择一项");
        }
        else
        {
          //服务器获取zNodes（所有的模块，标识出当前角色拥有模块）
          axios.request({
            url: 'api/module/all/' + this.updateForm.id,
            method: 'get'
          }).then(resp => {
            this.zNodes = resp.data.data
            //初始化ztree
            this.ztreeObj = $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
            this.updateModal = true
          })
        }
      },
      update () {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            //获取当前选中的ztree节点
            let checkedNodes = this.ztreeObj.getCheckedNodes(true)
            let moduleIds = []
            //checkedNodes<ZtreeVO> --> roleId(String)
            for (let i = 0; i < checkedNodes.length; i++) {
              let ztreeVO = checkedNodes[i]
              //ztreeVO-->String
              let roleId = ztreeVO.id
              //console.log(roleId)
              moduleIds.push(roleId)

            }
            //将roleId添加到this.updateForm.moduleId中
            this.updateForm.moduleIds = moduleIds
            axios.request({
              url: '/api/role',
              method: 'put',
              data: this.updateForm
            }).then((result) => {
              this.updateModal = false,
                this.$Message.success('操作成功!')
              this.gopage(this.page.number)
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
      remove () {
        if (this.groupId != null && this.groupId != '') {
          axios.request({
            url: '/api/role',
            method: 'delete',
            data: this.groupId
          }).then((result) => {
            if (result.data.code === 1) {
              this.$Message.success('操作成功!')
              this.gopage(this.page.number)
            }
          })
        } else {
          this.$Message.warning('请至少选择一项')
        }
      },
      gopage (pageNo) {
        this.tableLoding = true
        const pageSize = this.page.size
        const name = this.name
        axios.request({
          url: '/api/role',
          method: 'get',
          params: { pageNo, pageSize, name }
        }).then((result) => {
          this.page = result.data.data
          this.tableLoding = false
        })
      },
      cancel () {
        this.$Message.info('点击了取消')
      }
    },
    mounted: function () {
      this.gopage(1)
    }
  }


</script>
