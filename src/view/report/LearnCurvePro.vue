<template>
  <Card>
    <Row>

      <Col span="24">
        <Select filterable="true" placeholder="班级" v-model="searchForm.classId" style="width:200px">
          <Option v-for="c in classesList" :value="c.id">{{c.name}}-{{c.type}}</Option>
        </Select>
        <Select v-model="searchForm.courseId"  placeholder="课程" style="width:200px">
          <Option v-for="item in courseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <DatePicker type="daterange" @on-change="chooseDate"  placement="bottom-end" placeholder="选择起始日期" style="width: 200px"></DatePicker>
<!--        <InputNumber :max="20" :min="1" placeholder="课程第几天"  v-model="searchForm.dayNum"/>-->
<!--        <Input v-model="searchForm.stuName" placeholder="学员名字" style="width:200px"/>-->
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
        courseList:[
          {
            id:"",
            name:"--所有--"
          }
        ],
        classesList:[
          {
            id:"",
            name:"--所有--"
          }
        ],
        searchForm:{
          classId:"",
          stuName:"",
          courseId:"",
          dayNum:"",
          startDate:"",
          endDate:""
        },
        selected:[]
      }
    },
    methods:{
      chooseDate(e1){
        this.searchForm.startDate = e1[0];
        this.searchForm.endDate = e1[1];
      },
      initReport:function () {
        if(this.searchForm.classId){
          axios.request({
            url:"/api/report/learncurvepro",
            method: "post",
            data:this.searchForm
          }).then((resp)=>{
            let echart = echarts.init(document.getElementById("echarts"));

            echart.title = '学习曲线';

            var colors =['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];


            let option = {
              color: colors,

              tooltip: {
                trigger: 'none',
                axisPointer: {
                  type: 'cross'
                }
              },
              legend: {
                data:resp.data.legendData,
                selected:resp.data.selected
              },
              grid: {
                top: 70,
                bottom: 50
              },
              xAxis: [
                {
                  type: 'category',
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLine: {
                    onZero: false,
                    lineStyle: {
                      color: colors[0]
                    }
                  },
                  axisPointer: {
                    label: {
                      formatter: function (params) {
                        return  params.value + params.seriesData[0].seriesName
                          + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                      }
                    }
                  },
                  data: resp.data.xdata
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: resp.data.series
            };


            // 使用刚指定的配置项和数据显示图表。
            echart.setOption(option);

            //给window添加一个resize事件
            window.onresize=function () {
              echart.resize();
            }
          })
        }
        else {
          this.$Message.warning("必须选中班级查询");
        }

      }
    },
    mounted:function(){
      //
      this.$Notice.open({
        title: '个人学习曲线说明',
        desc: `1.需要指定班级才能查询。<br>
               2.已根据吸收程度升序排名(吸收最差的排第一)。<br>
               3.如果是一条直线，说明该同学没有提交反馈，取的他的平均值。<br>
               4.默认只选中吸收情况最不好的同学，如需查看其他同学，需单击选中名字查看。<br>
                `,
        duration: 0
      });
      //courseList
      axios.request({
        url: '/api/course/all',
        method: 'get'
      }).then((result) => {
        result.data.data.forEach(course=>{
          this.courseList.push(course);
        })

      }).catch((result)=>{
        this.$Message.error("哦豁，操作异常："+result);
      });

      axios.request({
        url: '/api/classes/all',
        method: 'get'
      }).then((result) => {
        result.data.data.forEach(classes=>{
          this.classesList.push(classes);
        })
      }).catch((result)=>{
        this.$Message.error("哦豁，操作异常："+result);
      });


      if(this.searchForm.stuName){
        this.initReport();
      }




    },
    watch:{
      searchForm:{
        handler(o,n){
          this.initReport();
        },
        deep:true
      }
    }

  }

</script>
