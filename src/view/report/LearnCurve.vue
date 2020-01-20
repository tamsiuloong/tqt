<template>
  <Card>
    <Row>

      <Col span="24">
        <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
          <Option v-for="c in classesList" :value="c.id">{{c.name}}<span v-if="c.type">-</span>{{c.type}}</Option>
        </Select>
        <Select v-model="searchForm.courseId"  placeholder="课程" style="width:200px">
          <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <DatePicker type="daterange" @on-change="chooseDate"  placement="bottom-end" placeholder="选择起始日期" style="width: 200px"></DatePicker>
<!--        <InputNumber :max="20" :min="1" placeholder="课程第几天"  v-model="searchForm.dayNum"/>-->
        <Input v-model="searchForm.stuName" placeholder="学员名字" style="width:200px"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="initReport()">搜索</Button>
      </Col>

    </Row>
  <br>
    <Row>
      <Col span="24">
        <div id="echarts" style="height: 500px;width: 100%;"></div>
      </Col>
    </Row>
  </Card>

</template>

<style scoped>
  .echarts {
    height: 500px;
    width: 100%;
    border-radius: 25px;
  }

</style>

<script>
import echarts from 'echarts'
import axios from '@/libs/api.request'
export default {
  data: function () {
    return {
      courseList: [
        {
          id: '',
          name: '--所有--'
        }
      ],
      classesList: [
        {
          id: '',
          name: '--所有--'
        }
      ],
      searchForm: {
        classId: '',
        stuName: '',
        courseId: '',
        dayNum: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    chooseDate (e1) {
      this.searchForm.startDate = e1[0]
      this.searchForm.endDate = e1[1]
    },
    initReport: function () {
      if (this.searchForm.stuName || this.searchForm.classId) {
        axios.request({
          url: '/api/report/learncurve',
          method: 'post',
          data: this.searchForm
        }).then((resp) => {
          let echart = echarts.init(document.getElementById('echarts'))
          // 指定图表的配置项和数据
          let option = {
            xAxis: {
              type: 'category',
              data: resp.data.titles
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: resp.data.values,
              type: 'line',
              smooth: true
            }]
          }

          // 使用刚指定的配置项和数据显示图表。
          echart.setOption(option)

          // 给window添加一个resize事件
          window.onresize = function () {
            echart.resize()
          }
        })
      } else {
        this.$Message.warning('必须输入学生名字查询')
      }
    }
  },
  mounted: function () {
    // courseList
    axios.request({
      url: '/api/course/all',
      method: 'get'
    }).then((result) => {
      result.data.data.forEach(course => {
        this.courseList.push(course)
      })
    }).catch((result) => {
      this.$Message.error('哦豁，操作异常：' + result)
    })

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

    if (this.searchForm.stuName) {
      this.initReport()
    }
  },
  watch: {
    searchForm: {
      handler (o, n) {
        this.initReport()
      },
      deep: true
    }
  }

}

</script>
