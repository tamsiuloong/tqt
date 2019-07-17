<template>
  <Card>
    <Row>

      <Col span="24">
        <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
          <Option v-for="c in classesList" :value="c.id">{{c.name}}</Option>
        </Select>
        <Select v-model="searchForm.courseId" placeholder="课程" style="width:200px">
          <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <InputNumber :max="20" :min="1" placeholder="课程第几天"  v-model="searchForm.dayNum"/>
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
  import echarts from 'echarts';
  import axios from '@/libs/api.request'
  export default {
    data: function () {
      return {
        courseList:[],
        classesList:[],
        searchForm:{
          classId:"",
          stuName:"",
          courseId:"",
          dayNum:""
        }
      }
    },
    methods:{
      initReport:function () {
        axios.request({
          url:"/api/report/absorption",
          method: "post",
          data:this.searchForm
        }).then((resp)=>{
          let echart = echarts.init(document.getElementById("echarts"));
          // 指定图表的配置项和数据
          let option = {
            title: {
              text: ''
            },
            tooltip: {},
            legend: {
              data:['学习吸收情况']
            },
            xAxis: {
              data:resp.data.titles
            },
            yAxis: {},
            series: [{
              name: '学习吸收情况',
              type: 'bar',
              data:resp.data.values
            }]
          };

          // 使用刚指定的配置项和数据显示图表。
          echart.setOption(option);

          //给window添加一个resize事件
          window.onresize=function () {
            echart.resize();
          }
        })
      }
    },
    mounted:function(){
      //courseList
      axios.request({
        url: '/api/course/all',
        method: 'get'
      }).then((result) => {
        this.courseList = result.data.data;
      }).catch((result)=>{
        this.$Message.error("哦豁，操作异常："+result);
      });

      axios.request({
        url: '/api/classes/all',
        method: 'get'
      }).then((result) => {
        this.classesList = result.data.data;
      }).catch((result)=>{
        this.$Message.error("哦豁，操作异常："+result);
      });



      this.initReport();



    }
  }

</script>
